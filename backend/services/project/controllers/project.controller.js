import redis from "../../../shared/redis/redis.js";
import ProjectModel from "../model/project.model.js";
import expressAsyncHandler from "express-async-handler";

/**
 * @createProject
 * @description create project
 * @header {x-user_id}
 * @body {name, description}
 */
const createProject = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }

        const { name, description } = req.body;
        const project = await ProjectModel.create({ owner: userId, name, description });

        // delete project list from redis
        const key = `project-list-${userId}`;
        await redis.del(key);
        res.status(201).json({
            message: "Project created successfully.", project
        });
    } catch (error) {
        console.log(`Error in createProject controller : ${error}`);
        next(error);
    }
});

/**
 * @getProjectList
 * @description get project list
 * @header {x-user_id}
 */
const getProjectList = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }
        // fetch project list from rdis first 
        const key = `project-list-${userId}`;
        let result = await redis.get(key);
        let projects;

        if (result) {
            projects = JSON.parse(result);
        } else {
            projects = await ProjectModel.find({ owner: userId }).sort({ createdAt: -1 });
            // set project list in redis
            await redis.set(key, JSON.stringify(projects));
        }

        res.status(200).json(projects);
    } catch (error) {
        console.log(`Error in getProjectList controller: ${error}`);
        next(error);
    }
})

/**
 * @getProjectById
 * @description get project by id
 * @header {x-user_id}
 * @params {projectId}
 */
const getProjectById = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }
        const { projectId } = req.params;
        const project = await ProjectModel.findById(projectId);
        if (project.owner.toString() !== userId) {
            return res.status(401).json({
                message: "Unauthorized, You are not the owner of this project."
            });
        }
        project.lastOpenedAt = new Date();
        await project.save();
        res.status(200).json({
            message: "Project fetched successfully.", project
        });
    } catch (error) {
        console.log(`Error in getProjectById controller: ${error}`);
        next(error);
    }
});

/**
 * @toggleProjectStarred
 * @description star project
 * @header {x-user_id}
 * @params {projectId}
*/
const toggleProjectStarred = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }
        const { projectId } = req.params;
        const project = await ProjectModel.findById(projectId);
        if (project.owner.toString() !== userId) {
            return res.status(401).json({
                message: "Unauthorized, You are not the owner of this project."
            });
        }
        project.starred = !project.starred;
        await project.save();
        // delete starred project list from redis
        const key = `project-list-${userId}`
        const starredkey = `starred-project-list-${userId}`;
        await redis.del(starredkey)
        await redis.del(key);

        // return response
        res.status(200).json({
            message: "Project starred successfully.", project
        });
    } catch (error) {
        console.log(`Error in setProjectStarred controller: ${error}`);
        next(error);
    }
});

/**
 * @getStarredProjectList
 * @description get starred project list
 * @header {x-user_id}
 */
const getStarredProjectList = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }
        const key = `starred-project-list-${userId}`;
        const result = await redis.get(key);
        let projects;
        if (result) {
            projects = JSON.parse(result);
        }
        else {
            projects = await ProjectModel.find({ owner: userId, starred: true }).sort({ createdAt: -1 });
            // save starred project list in redis
            await redis.set(key, JSON.stringify(projects));
        }
        res.status(200).json(projects);
    } catch (error) {
        console.log(`Error in getStarredProjectList controller: ${error}`);
        next(error);
    }
})


/**
 * @deleteProject
 * @description delete project
 * @header {x-user_id}
 * @params {projectId}
 */
const deleteProject = expressAsyncHandler(async (req, res, next) => {
    try {
        const userId = req.headers["x-user_id"];
        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized, user Id not found."
            });
        }
        const { projectId } = req.params;
        const project = await ProjectModel.findById(projectId);
        if (project.owner.toString() !== userId) {
            return res.status(401).json({
                message: "Unauthorized, You are not the owner of this project."
            });
        }
        await project.deleteOne();
        // delete project list from redis
        const key = `project-list-${userId}`;
        // if deleted project is a starred project then also delete starred projects from the cache
        if (project.starred) {
            const starredkey = `starred-project-list-${userId}`;
            await redis.del(starredkey)
        }
        await redis.del(key);
        res.status(200).json({
            message: "Project deleted successfully.", project
        });
    } catch (error) {
        console.log(`Error in deleteProject controller: ${error}`);
        next(error);
    }

})

export { createProject, getProjectById, getProjectList, toggleProjectStarred, getStarredProjectList, deleteProject };