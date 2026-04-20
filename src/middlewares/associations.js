import pool from "#root/db/config.js";

// Individual resolvers - fetch a single related record by FK id
const resolvers = {
  language: async (languageId) => {
    if (!languageId) return null;
    const [rows] = await pool.promise().query('SELECT * FROM languages WHERE languageId = ?', [languageId]);
    return rows[0] || null;
  },
  institution: async (institutionId) => {
    if (!institutionId) return null;
    const [rows] = await pool.promise().query('SELECT * FROM institutions WHERE institutionId = ?', [institutionId]);
    return rows[0] || null;
  },
  literature: async (literatureId) => {
    if (!literatureId) return null;
    const [rows] = await pool.promise().query('SELECT * FROM literature WHERE literatureId = ?', [literatureId]);
    return rows[0] || null;
  },
  researchGroups: async (institutionId) => {
    if (!institutionId) return [];
    const [rows] = await pool.promise().query('SELECT * FROM research_groups WHERE institutionId = ? ORDER BY name ASC', [institutionId]);
    return rows;
  },
  literatureInstitutions: async (literatureId) => {
    if (!literatureId) return [];
    const [rows] = await pool.promise().query(
      `SELECT inst.*, li.is_primary
       FROM literature_institutions li
       JOIN institutions inst ON li.institutionId = inst.institutionId
       WHERE li.literatureId = ?
       ORDER BY li.is_primary DESC, inst.name ASC`,
      [literatureId]
    );
    return rows;
  }
};

// Enrich a single item with its FK associations
async function enrichItem(item, associations) {
  const enriched = { ...item };
  await Promise.all(
    associations.map(async ({ key, fkField, resolver }) => {
      enriched[key] = await resolvers[resolver](item[fkField]);
    })
  );
  return enriched;
}

// Enrich a list of items, caching identical FK lookups to avoid redundant queries
async function enrichList(items, associations) {
  const cache = {};

  async function cachedResolve(resolver, fkValue) {
    const cacheKey = `${resolver}:${fkValue}`;
    if (!(cacheKey in cache)) {
      cache[cacheKey] = resolvers[resolver](fkValue);
    }
    return cache[cacheKey];
  }

  return Promise.all(
    items.map(async (item) => {
      const enriched = { ...item };
      await Promise.all(
        associations.map(async ({ key, fkField, resolver }) => {
          enriched[key] = await cachedResolve(resolver, item[fkField]);
        })
      );
      return enriched;
    })
  );
}

/**
 * Middleware factory — wraps res.json to enrich response data with FK associations.
 *
 * @param {Array<{key: string, fkField: string, resolver: string}>} associations
 *   key      – property name on the response object  (e.g. "Language")
 *   fkField  – FK column on the source row            (e.g. "languageId")
 *   resolver – resolver name to call                  (e.g. "language")
 *
 * Usage:
 *   router.get('/', withAssociations([...]), getAllLiterature);
 */
export function withAssociations(associations) {
  return (req, res, next) => {
    const originalJson = res.json.bind(res);

    res.json = async (body) => {
      try {
        if (body && body.success && body.data) {
          if (Array.isArray(body.data)) {
            body.data = await enrichList(body.data, associations);
          } else {
            body.data = await enrichItem(body.data, associations);
          }
        }
      } catch (error) {
        console.error('Error enriching associations:', error);
      }
      return originalJson(body);
    };

    next();
  };
}
