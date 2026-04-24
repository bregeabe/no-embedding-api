import pool from "#root/db/config.js";
import { v4 as uuidv4 } from "uuid";

export const getAllLanguages = async (req, res) => {
  try {
    const [languages] = await pool.promise().query('SELECT * FROM languages ORDER BY name ASC');
    
    const languagesWithAssociations = await Promise.all(languages.map(async (language) => {
      const languageId = language.languageId || language.id;
      
      const [literature] = await pool.promise().query(
        'SELECT * FROM literature WHERE languageId = ?', 
        [languageId]
      );
      
      return {
        ...language,
        associations: {
          literature: literature || [],
        }
      };
    }));
    
    res.json({
      success: true,
      data: languagesWithAssociations,
      count: languagesWithAssociations.length
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch languages'
    });
  }
};

export const getLanguageById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.promise().query('SELECT * FROM languages WHERE languageId = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Language not found'
      });
    }

    const language = rows[0];
    const languageId = language.languageId || language.id;
    
    const [literature] = await pool.promise().query(
      'SELECT * FROM literature WHERE languageId = ?', 
      [languageId]
    );
    
    const [institutions] = await pool.promise().query(
      'SELECT DISTINCT i.* FROM institutions i JOIN literature_institutions li ON i.institutionId = li.institutionId JOIN literature l ON li.literatureId = l.literatureId WHERE l.languageId = ?',
      [languageId]
    );
    
    const [researchGroups] = await pool.promise().query(
      'SELECT DISTINCT rg.* FROM research_groups rg JOIN institutions i ON rg.institutionId = i.institutionId JOIN literature_institutions li ON i.institutionId = li.institutionId JOIN literature l ON li.literatureId = l.literatureId WHERE l.languageId = ?',
      [languageId]
    );

    res.json({
      success: true,
      data: {
        ...language,
        associations: {
          literature: literature || [],
          institutions: institutions || [],
          researchGroups: researchGroups || []
        }
      }
    });
  } catch (error) {
    console.error('Error fetching language:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch language'
    });
  }
};

export const createLanguage = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        error: 'Name and code are required'
      });
    }

    const id = uuidv4();
    const query = 'INSERT INTO languages (languageId, name, code, description, created_at) VALUES (?, ?, ?, ?, NOW())';
    
    await pool.promise().query(query, [id, name, code, description]);
    
    res.status(201).json({
      success: true,
      data: { id, name, code, description },
      message: 'Language created successfully'
    });
  } catch (error) {
    console.error('Error creating language:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: 'Language code already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create language'
    });
  }
};

export const updateLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;
    
    const query = 'UPDATE languages SET name = ?, code = ?, description = ?, updated_at = NOW() WHERE languageId = ?';
    const [result] = await pool.promise().query(query, [name, code, description, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Language not found'
      });
    }

    res.json({
      success: true,
      message: 'Language updated successfully'
    });
  } catch (error) {
    console.error('Error updating language:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update language'
    });
  }
};

export const deleteLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.promise().query('DELETE FROM languages WHERE languageId = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Language not found'
      });
    }

    res.json({
      success: true,
      message: 'Language deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting language:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete language'
    });
  }
};