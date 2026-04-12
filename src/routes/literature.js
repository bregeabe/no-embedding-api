import { Router } from "express";
import { 
  getAllLiterature,
  getLiteratureById,
  createLiterature,
  updateLiterature,
  deleteLiterature
} from "#root/src/controllers/literatureController.js";

const router = Router();

router.get('/', getAllLiterature);

router.get('/:id', getLiteratureById);

router.post('/', createLiterature);

router.put('/:id', updateLiterature);

router.delete('/:id', deleteLiterature);

export default router;