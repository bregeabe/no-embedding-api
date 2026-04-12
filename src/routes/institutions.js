import { Router } from "express";
import { 
  getAllInstitutions,
  getInstitutionById,
  createInstitution,
  updateInstitution,
  deleteInstitution
} from "#root/src/controllers/institutionsController.js";

const router = Router();

router.get('/', getAllInstitutions);

router.get('/:id', getInstitutionById);

router.post('/', createInstitution);

router.put('/:id', updateInstitution);

router.delete('/:id', deleteInstitution);

export default router;