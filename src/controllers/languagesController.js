import pool from "#root/db/config.js";
import { v4 as uuidv4 } from "uuid";

export const getAllLanguages = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM languages ORDER BY name ASC');
    res.json({
      success: true,
      data: rows,
      count: rows.length
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

    res.json({
      success: true,
      data: rows[0]
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
    const { name, repoUrl, type, host } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    const id = uuidv4();
    const query = 'INSERT INTO languages (languageId, name, repoUrl, type, host, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
    
    await pool.promise().query(query, [id, name, repoUrl, type, host]);
    
    res.status(201).json({
      success: true,
      data: { id, name, repoUrl, type, host },
      message: 'Language created successfully'
    });
  } catch (error) {
    console.error('Error creating language:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: 'Language repoUrl already exists'
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
    const { name, repoUrl, type, host } = req.body;
    
    const query = 'UPDATE languages SET name = ?, repoUrl = ?, type = ?, host = ?, updated_at = NOW() WHERE languageId = ?';
    const [result] = await pool.promise().query(query, [name, repoUrl, type, host, id]);
    
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