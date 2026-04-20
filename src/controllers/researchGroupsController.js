import pool from "#root/db/config.js";
import { v4 as uuidv4 } from "uuid";

export const getAllResearchGroups = async (req, res) => {
  try {
    const [rows] = await pool.promise().query('SELECT * FROM research_groups ORDER BY name ASC');
    res.json({
      success: true,
      data: rows,
      count: rows.length
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
    const [rows] = await pool.promise().query('SELECT * FROM research_groups WHERE researchGroupId = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Research group not found'
      });
    }

    res.json({
      success: true,
      data: rows[0]
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

    const query = 'UPDATE research_groups SET name = ?, url = ?, institutionId = ?, updated_at = NOW() WHERE researchGroupId = ?';
    const [result] = await pool.promise().query(query, [name, url, institutionId, id]);

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

    const [result] = await pool.promise().query('DELETE FROM research_groups WHERE researchGroupId = ?', [id]);

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
