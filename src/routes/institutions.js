import { Router } from "express";
import { 
  getAllInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution
} from "#root/src/controllers/institutionsController.js";
import { withAssociations } from "#root/src/middlewares/associations.js";

const institutionAssociations = [
  { key: 'ResearchGroups', fkField: 'institutionId', resolver: 'researchGroups' }
];

const router = Router();

router.get('/', withAssociations(institutionAssociations), getAllInstitutions);

router.get('/:id', withAssociations(institutionAssociations), getInstitutionById);

router.post('/', createInstitution);

router.put('/:id', updateInstitution);

router.delete('/:id', deleteInstitution);

export default router;