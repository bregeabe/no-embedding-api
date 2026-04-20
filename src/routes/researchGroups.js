import { Router } from "express";
import {
  getAllResearchGroups,
  getResearchGroupById,
  createResearchGroup,
  updateResearchGroup,
  deleteResearchGroup
} from "#root/src/controllers/researchGroupsController.js";
import { withAssociations } from "#root/src/middlewares/associations.js";

const researchGroupAssociations = [
  { key: 'Institution', fkField: 'institutionId', resolver: 'institution' }
];

const router = Router();

router.get('/', withAssociations(researchGroupAssociations), getAllResearchGroups);

router.get('/:id', withAssociations(researchGroupAssociations), getResearchGroupById);

router.post('/', createResearchGroup);

router.put('/:id', updateResearchGroup);

router.delete('/:id', deleteResearchGroup);

export default router;
