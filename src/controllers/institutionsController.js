import pool from "#root/db/config.js";
import { v4 as uuidv4 } from "uuid";

export const getAllInstitutions = async (req, res) => {
  try {
    const [institutions] = await pool.promise().query('SELECT * FROM institutions ORDER BY name ASC');
    
    const institutionsWithAssociations = await Promise.all(institutions.map(async (institution) => {
      const [researchGroups] = await pool.promise().query(
        'SELECT * FROM research_groups WHERE institutionId = ?', 
        [institution.institutionId]
      );
      
      const [literature] = await pool.promise().query(
        'SELECT * FROM literature WHERE institutionId = ?', 
        [institution.institutionId]
      );
      
      const literatureWithAssociations = await Promise.all(literature.map(async (lit) => {
        const languageId = lit.languageId || lit.language_id;
        const [languages] = await pool.promise().query(
          'SELECT * FROM languages WHERE languageId = ?', 
          [languageId]
        );
        return {
          ...lit,
          associations: {
            language: languages[0] || null
          }
        };
      }));

      return {
        ...institution,
        associations: {
          researchGroups: researchGroups || [],
          literature: literatureWithAssociations || [],
        }
      };
    }));
    
    
    res.json({
      success: true,
      data: institutionsWithAssociations,
      count: institutionsWithAssociations.length
    });
  } catch (error) {
    console.error('Error fetching institutions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch institutions'
    });
  }
};

export const getInstitutionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.promise().query('SELECT * FROM institutions WHERE institutionId = ? OR id = ?', [id, id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Institution not found'
      });
    }

    const institution = rows[0];
    const institutionId = institution.institutionId;
    
    const [researchGroups] = await pool.promise().query(
      'SELECT * FROM research_groups WHERE institutionId = ?', 
      [institutionId]
    );
    
    const [literature] = await pool.promise().query(
      'SELECT DISTINCT l.* FROM literature l JOIN literature_institutions li ON l.literatureId = li.literatureId WHERE li.institutionId = ?', 
      [institutionId]
    );
    
    const [languages] = await pool.promise().query(
      'SELECT DISTINCT lang.* FROM languages lang JOIN literature l ON lang.languageId = l.languageId JOIN literature_institutions li ON l.literatureId = li.literatureId WHERE li.institutionId = ?',
      [institutionId]
    );

    res.json({
      success: true,
      data: {
        ...institution,
        associations: {
          researchGroups: researchGroups || [],
          literature: literature || [],
          languages: languages || []
        }
      }
    });
  } catch (error) {
    console.error('Error fetching institution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch institution'
    });
  }
};

export const createInstitution = async (req, res) => {
  try {
    const { name, location, type, description } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    const id = uuidv4();
    const query = 'INSERT INTO institutions (id, name, location, type, description, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
    
    await pool.promise().query(query, [id, name, location, type, description]);
    
    res.status(201).json({
      success: true,
      data: { id, name, location, type, description },
      message: 'Institution created successfully'
    });
  } catch (error) {
    console.error('Error creating institution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create institution'
    });
  }
};

export const updateInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, type, description } = req.body;
    
    const query = 'UPDATE institutions SET name = ?, location = ?, type = ?, description = ?, updated_at = NOW() WHERE id = ?';
    const [result] = await pool.promise().query(query, [name, location, type, description, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Institution not found'
      });
    }

    res.json({
      success: true,
      message: 'Institution updated successfully'
    });
  } catch (error) {
    console.error('Error updating institution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update institution'
    });
  }
};

export const deleteInstitution = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.promise().query('DELETE FROM institutions WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Institution not found'
      });
    }

    res.json({
      success: true,
      message: 'Institution deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting institution:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete institution'
    });
  }
};