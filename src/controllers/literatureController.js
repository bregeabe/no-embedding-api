import pool from "#root/db/config.js";
import { v4 as uuidv4 } from "uuid";

export const getAllLiterature = async (req, res) => {
  try {
    const [literature] = await pool.promise().query('SELECT * FROM literature ORDER BY created_at DESC');
    
    const literatureWithAssociations = await Promise.all(literature.map(async (item) => {
      const literatureId = item.literatureId || item.id;
      const languageId = item.languageId || item.language_id;
      
      const [languages] = await pool.promise().query(
        'SELECT * FROM languages WHERE languageId = ?', 
        [languageId]
      );
      
      const [institutions] = await pool.promise().query(
        'SELECT DISTINCT i.* FROM institutions i JOIN literature_institutions li ON i.institutionId = li.institutionId WHERE li.literatureId = ?',
        [literatureId]
      );
      
      const institutionIds = institutions.map(inst => inst.institutionId);
      let researchGroups = [];
      if (institutionIds.length > 0) {
        const [rgs] = await pool.promise().query(
          `SELECT * FROM research_groups WHERE institutionId IN (${institutionIds.map(() => '?').join(',')})`,
          institutionIds
        );
        researchGroups = rgs;
      }
      
      return {
        ...item,
        associations: {
          language: languages[0] || null,
          institutions: institutions || [],
          researchGroups: researchGroups || []
        }
      };
    }));
    
    res.json({
      success: true,
      data: literatureWithAssociations,
      count: literatureWithAssociations.length
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
    const [rows] = await pool.promise().query('SELECT * FROM literature WHERE literatureId = ? OR id = ?', [id, id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Literature not found'
      });
    }

    const literature = rows[0];
    const literatureId = literature.literatureId || literature.id;
    const languageId = literature.languageId || literature.language_id;
    
    const [languages] = await pool.promise().query(
      'SELECT * FROM languages WHERE languageId = ? OR id = ?', 
      [languageId, languageId]
    );
    
    const [institutions] = await pool.promise().query(
      'SELECT DISTINCT i.* FROM institutions i JOIN literature_institutions li ON i.institutionId = li.institutionId WHERE li.literatureId = ?',
      [literatureId]
    );
    
    const institutionIds = institutions.map(inst => inst.institutionId);
    let researchGroups = [];
    if (institutionIds.length > 0) {
      const [rgs] = await pool.promise().query(
        `SELECT * FROM research_groups WHERE institutionId IN (${institutionIds.map(() => '?').join(',')})`,
        institutionIds
      );
      researchGroups = rgs;
    }

    res.json({
      success: true,
      data: {
        ...literature,
        associations: {
          language: languages[0] || null,
          institutions: institutions || [],
          researchGroups: researchGroups || []
        }
      }
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