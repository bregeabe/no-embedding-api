import { Router } from "express";
import { 
  getAllResearchGroups,
  getResearchGroupById,
  createResearchGroup,
  updateResearchGroup,
  deleteResearchGroup
} from "#root/src/controllers/researchGroupsController.js";

const router = Router();

router.get('/', getAllResearchGroups);

router.get('/:id', getResearchGroupById);

router.post('/', createResearchGroup);

router.put('/:id', updateResearchGroup);

router.delete('/:id', deleteResearchGroup);

export default router;