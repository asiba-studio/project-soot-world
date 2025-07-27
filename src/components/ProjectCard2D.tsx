import React from "react";
import { Project, ProjectWithMembers } from "@/lib/types";

interface ProjectCard2DProps {
    // プロジェクトデータの型を定義
    project: ProjectWithMembers;
    onCardClick?: (project: ProjectCard2DProps['project']) => void;
}


export default function ProjectCard2D({ project, onCardClick }: ProjectCard2DProps) {
    // クリックイベントハンドラ
    const handleCardClick = () => {
        if (onCardClick) {
            onCardClick(project);
        }
    };

    return (
        <div>
            <div
                className="bg-white p-2"
                onClick={handleCardClick}
            >
                <div className="text-xl font-bold text-blue-800">{project.title}</div>
                <img src={project.cover!} className='w-full my-1' />
                <div className="text-sm opacity-75 my-1">
                    <p><strong>Category:</strong> {project.category}</p>
                    <p><strong>Status:</strong> {project.status}</p>
                    <p><strong>Members:</strong> {project.members.map(m => m.player.name).join(', ')}</p>
                    <p><strong>Started At:</strong> {new Date(project.start_date).toLocaleDateString()}</p>
                    <p><strong>Keywords:</strong> {project.keywords.join(', ')}</p>
                </div>
                <p className='text-sm font-semibold my-1 opacity-75'>
                    {project.description}
                </p>
            </div>
        </div>
    )
}
