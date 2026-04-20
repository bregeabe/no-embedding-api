import pool from "#root/db/config.js";
import { v4 as uuidv4 } from "uuid";

export const getAllLiterature = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM literature ORDER BY created_at DESC');
    
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching literature:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch literature'
    });
  }
};

export const getLiteratureById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.promise().query('SELECT * FROM literature WHERE literatureId = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Literature not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching literature:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch literature'
    });
  }
};

export const createLiterature = async (req, res) => {
  try {
    const { title, author, abstract, languageId, institutionId, publication_year, doi_url, open_access_url, reference } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({
        success: false,
        error: 'Title and author are required'
      });
    }

    const id = uuidv4();
    const query = `
      INSERT INTO literature (literatureId, title, author, abstract, languageId, institutionId, publication_year, doi_url, open_access_url, reference, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await pool.promise().query(query, [id, title, author, abstract, languageId, institutionId, publication_year, doi_url, open_access_url, reference]);
    
    res.status(201).json({
      success: true,
      data: { id, title, author, abstract, languageId, institutionId, publication_year, doi_url, open_access_url, reference },
      message: 'Literature created successfully'
    });
  } catch (error) {
    console.error('Error creating literature:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create literature'
    });
  }
};

export const updateLiterature = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, abstract, languageId, institutionId, publication_year, doi_url, open_access_url, reference } = req.body;
    
    const query = `
      UPDATE literature 
      SET title = ?, author = ?, abstract = ?, languageId = ?, institutionId = ?, publication_year = ?, doi_url = ?, open_access_url = ?, reference = ?, updated_at = NOW() 
      WHERE literatureId = ?
    `;
    const [result] = await pool.promise().query(query, [title, author, abstract, languageId, institutionId, publication_year, doi_url, open_access_url, reference, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Literature not found'
      });
    }

    res.json({
      success: true,
      message: 'Literature updated successfully'
    });
  } catch (error) {
    console.error('Error updating literature:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update literature'
    });
  }
};

export const deleteLiterature = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.promise().query('DELETE FROM literature WHERE literatureId = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Literature not found'
      });
    }

    res.json({
      success: true,
      message: 'Literature deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting literature:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete literature'
    });
  }
};