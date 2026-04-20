import { Router } from "express";
import { 
  getAllLiterature,
  getLiteratureById,
  createLiterature,
  updateLiterature,
  deleteLiterature
} from "#root/src/controllers/literatureController.js";
import { withAssociations } from "#root/src/middlewares/associations.js";

const literatureAssociations = [
  { key: 'Language', fkField: 'languageId', resolver: 'language' },
  { key: 'Institution', fkField: 'institutionId', resolver: 'institution' },
  { key: 'Institutions', fkField: 'literatureId', resolver: 'literatureInstitutions' }
];

const router = Router();

router.get('/', withAssociations(literatureAssociations), getAllLiterature);

router.get('/:id', withAssociations(literatureAssociations), getLiteratureById);

router.post('/', createLiterature);

router.put('/:id', updateLiterature);

router.delete('/:id', deleteLiterature);

export default router;