import pool from "#root/db/config.js";
import { v4 as uuidv4 } from "uuid";

export const getAllLiterature = async (req, res) => {
  try {
    const [rows] = await pool.promise().query(`
      SELECT l.*, 
             lang.name as language_name, 
             inst.name as institution_name 
      FROM literature l
      LEFT JOIN languages lang ON l.language_id = lang.id
      LEFT JOIN institutions inst ON l.institution_id = inst.id
      ORDER BY l.created_at DESC
    `);
    
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
    const [rows] = await pool.promise().query(`
      SELECT l.*, 
             lang.name as language_name, 
             inst.name as institution_name 
      FROM literature l
      LEFT JOIN languages lang ON l.language_id = lang.id
      LEFT JOIN institutions inst ON l.institution_id = inst.id
      WHERE l.id = ?
    `, [id]);
    
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
    const { title, author, abstract, language_id, institution_id, publication_year, pdf_path } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({
        success: false,
        error: 'Title and author are required'
      });
    }

    const id = uuidv4();
    const query = `
      INSERT INTO literature (id, title, author, abstract, language_id, institution_id, publication_year, pdf_path, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await pool.promise().query(query, [id, title, author, abstract, language_id, institution_id, publication_year, pdf_path]);
    
    res.status(201).json({
      success: true,
      data: { id, title, author, abstract, language_id, institution_id, publication_year, pdf_path },
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
    const { title, author, abstract, language_id, institution_id, publication_year, pdf_path } = req.body;
    
    const query = `
      UPDATE literature 
      SET title = ?, author = ?, abstract = ?, language_id = ?, institution_id = ?, publication_year = ?, pdf_path = ?, updated_at = NOW() 
      WHERE id = ?
    `;
    const [result] = await pool.promise().query(query, [title, author, abstract, language_id, institution_id, publication_year, pdf_path, id]);
    
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
    
    const [result] = await pool.promise().query('DELETE FROM literature WHERE id = ?', [id]);
    
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