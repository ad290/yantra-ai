import express from 'express'
import { createProject, deleteProject, getProjectById, getProjectList, getStarredProjectList, toggleProjectStarred } from '../controllers/project.controller.js';


/**
 * @projectRouter
 * @description project routes
*/
const projectRouter = express.Router();

/**
 * @createproject route
 * @description create project
 * @method POST
 * @route /
 */
projectRouter.post("/", createProject);

/**
 * @getProjectList route
 * @description get project list
 * @method GET
 * @route /all
 */
projectRouter.get("/all", getProjectList);

/**
 * @getStarredProjectList route
 * @description get starred project list
 * @method GET
 * @route /starred
 */
projectRouter.get("/starred", getStarredProjectList);

/**
 * @getProjectById route
 * @description get project by id
 * @method GET
 * @params {projectId}
 * @route /single/:projectId
 */
projectRouter.get("/single/:projectId", getProjectById);

/**
 * @toggleProjectStarred route
 * @description star project
 * @method PATCH
 * @params {projectId}
 * @route /starred/:projectId
 */
projectRouter.patch('/starred/:projectId', toggleProjectStarred);

/**
 * @deleteProject route
 * @description delete project
 * @method DELETE
 * @params {projectId}
 * @route /single/:projectId
 */
projectRouter.delete('/single/:projectId', deleteProject);

export default projectRouter;