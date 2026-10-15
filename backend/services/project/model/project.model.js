import mongoose from "mongoose";
const ProjectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    starred: {
        type: Boolean,
        default: false
    },
    lastOpenedAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true});

const ProjectModel = mongoose.model("Project", ProjectSchema);
export default ProjectModel;