import pool from "#root/db/config.js";
import { v4 as uuidv4 } from "uuid";

export const getAllInstitutions = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM institutions ORDER BY name ASC');
    res.json({
      success: true,
      data: rows,
      count: rows.length
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
    const [rows] = await pool.promise().query('SELECT * FROM institutions WHERE institutionId = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Institution not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
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
    const { shortName, name, location, type } = req.body;
    
    if (!name || !shortName) {
      return res.status(400).json({
        success: false,
        error: 'Name and shortName are required'
      });
    }

    const id = uuidv4();
    const query = 'INSERT INTO institutions (institutionId, shortName, name, location, type, created_at) VALUES (?, ?, ?, ?, ?, NOW())';
    
    await pool.promise().query(query, [id, shortName, name, location, type]);
    
    res.status(201).json({
      success: true,
      data: { id, shortName, name, location, type },
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
    const { shortName, name, location, type } = req.body;
    
    const query = 'UPDATE institutions SET shortName = ?, name = ?, location = ?, type = ?, updated_at = NOW() WHERE institutionId = ?';
    const [result] = await pool.promise().query(query, [shortName, name, location, type, id]);
    
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
    
    const [result] = await pool.promise().query('DELETE FROM institutions WHERE institutionId = ?', [id]);
    
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