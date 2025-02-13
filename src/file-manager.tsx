import React, { useState } from "react";

// Types for our file system
interface FileSystemItem {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
}

interface FileManagerState {
  items: FileSystemItem[];
  currentPath: string[];
  currentFolderId: string;
}

export const FileManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [fileSystem, setFileSystem] = useState<FileManagerState>({
    items: [{ id: "root", name: "Root", type: "folder", parentId: null }],
    currentPath: ["Root"],
    currentFolderId: "root",
  });

  const createFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder: FileSystemItem = {
      id: crypto.randomUUID(),
      name: newFolderName,
      type: "folder",
      parentId: fileSystem.currentFolderId,
    };

    setFileSystem((prev) => ({
      ...prev,
      items: [...prev.items, newFolder],
    }));

    setNewFolderName("");
    setIsModalOpen(false);
  };

  const navigateToFolder = (folderId: string) => {
    const folder = fileSystem.items.find((item) => item.id === folderId);
    if (!folder) return;

    const path: string[] = [folder.name];
    let currentParent = folder.parentId;

    while (currentParent) {
      const parent = fileSystem.items.find((item) => item.id === currentParent);
      if (parent) {
        path.unshift(parent.name);
        currentParent = parent.parentId;
      } else {
        break;
      }
    }

    setFileSystem((prev) => ({
      ...prev,
      currentPath: path,
      currentFolderId: folderId,
    }));
  };

  const handleBreadcrumbClick = (index: number) => {
    const pathToClick = fileSystem.currentPath[index];
    const targetFolder = fileSystem.items.find(
      (item) => item.name === pathToClick
    );

    if (targetFolder) {
      navigateToFolder(targetFolder.id);
    }
  };

  const getCurrentFolderContents = () => {
    return fileSystem.items.filter(
      (item) => item.parentId === fileSystem.currentFolderId
    );
  };

  return (
    <div className="p-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
        {fileSystem.currentPath.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <span className="mx-2">/</span>}
            <span
              onClick={() => handleBreadcrumbClick(index)}
              className="hover:text-blue-600 cursor-pointer"
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          New Folder
        </button>
      </div>

      {/* Folder Contents */}
      <div className="grid grid-cols-4 gap-4">
        {getCurrentFolderContents().map((item) => (
          <div
            key={item.id}
            onDoubleClick={() =>
              item.type === "folder" && navigateToFolder(item.id)
            }
            className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {item.type === "folder" ? (
                <svg
                  className="w-6 h-6 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              )}
              <span className="truncate">{item.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New Folder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Folder name"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
