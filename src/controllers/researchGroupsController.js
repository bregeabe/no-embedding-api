import pool from "#root/db/config.js";
import { v4 as uuidv4 } from "uuid";

export const getAllResearchGroups = async (req, res) => {
  try {
    const [researchGroups] = await pool.promise().query('SELECT * FROM research_groups ORDER BY name ASC');
    
    // Get associations for each research group
    const researchGroupsWithAssociations = await Promise.all(researchGroups.map(async (group) => {
      const groupId = group.researchGroupId || group.id;
      const institutionId = group.institutionId;
      
      // Get the parent institution
      const [institutions] = await pool.promise().query(
        'SELECT * FROM institutions WHERE institutionId = ? OR id = ?', 
        [institutionId, institutionId]
      );
      
      const [literature] = await pool.promise().query(
        'SELECT DISTINCT l.* FROM literature l JOIN literature_institutions li ON l.literatureId = li.literatureId WHERE li.institutionId = ?',
        [institutionId]
      );
      
      const [languages] = await pool.promise().query(
        'SELECT DISTINCT lang.* FROM languages lang JOIN literature l ON lang.languageId = l.languageId JOIN literature_institutions li ON l.literatureId = li.literatureId WHERE li.institutionId = ?',
        [institutionId]
      );
      
      return {
        ...group,
        associations: {
          institution: institutions[0] || null,
          literature: literature || [],
          languages: languages || []
        }
      };
    }));
    
    res.json({
      success: true,
      data: researchGroupsWithAssociations,
      count: researchGroupsWithAssociations.length
    });
  } catch (error) {
    console.error('Error fetching research groups:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch research groups'
    });
  }
};

export const getResearchGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.promise().query('SELECT * FROM research_groups WHERE researchGroupId = ? OR id = ?', [id, id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Research group not found'
      });
    }

    const researchGroup = rows[0];
    const groupId = researchGroup.researchGroupId || researchGroup.id;
    const institutionId = researchGroup.institutionId;
    
    // Get associations
    const [institutions] = await pool.promise().query(
      'SELECT * FROM institutions WHERE institutionId = ? OR id = ?', 
      [institutionId, institutionId]
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
        ...researchGroup,
        associations: {
          institution: institutions[0] || null,
          literature: literature || [],
          languages: languages || []
        }
      }
    });
  } catch (error) {
    console.error('Error fetching research group:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch research group'
    });
  }
};

export const createResearchGroup = async (req, res) => {
  try {
    const { name, url, institutionId } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    const id = uuidv4();
    const query = 'INSERT INTO research_groups (researchGroupId, name, url, institutionId, created_at) VALUES (?, ?, ?, ?, NOW())';
    
    await pool.promise().query(query, [id, name, url, institutionId]);
    
    res.status(201).json({
      success: true,
      data: { id, name, url, institutionId },
      message: 'Research group created successfully'
    });
  } catch (error) {
    console.error('Error creating research group:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: 'Research group URL already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create research group'
    });
  }
};

export const updateResearchGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, institutionId } = req.body;
    
    const query = 'UPDATE research_groups SET name = ?, url = ?, institutionId = ?, updated_at = NOW() WHERE researchGroupId = ? OR id = ?';
    const [result] = await pool.promise().query(query, [name, url, institutionId, id, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Research group not found'
      });
    }

    res.json({
      success: true,
      message: 'Research group updated successfully'
    });
  } catch (error) {
    console.error('Error updating research group:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update research group'
    });
  }
};

export const deleteResearchGroup = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.promise().query('DELETE FROM research_groups WHERE researchGroupId = ? OR id = ?', [id, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Research group not found'
      });
    }

    res.json({
      success: true,
      message: 'Research group deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting research group:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete research group'
    });
  }
};