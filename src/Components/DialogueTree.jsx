import React, { useState } from 'react';
import { SortableTree } from '@nosferatu500/react-sortable-tree';
import '@nosferatu500/react-sortable-tree/style.css';
import './main.css';
import {
    DEFAULT_NODE_TITLE,
    NodeType,
    addChildNode,
    createInitialTree,
    deleteNode,
    isRootNode,
    renameNode,
    serializeTree,
    toggleNodeType,
} from '../lib/tree';

export default function DialogueTree() {
    const [treeData, setTreeData] = useState(createInitialTree);
    const [text, setText] = useState(DEFAULT_NODE_TITLE);
    const [show, setShow] = useState();

    const exportData = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            serializeTree(treeData)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "data.json";

        link.click();
    };
    
    //function to import data from json file and set it to treeData 
    const importData = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const treeData = JSON.parse(e.target.result);
            setTreeData(treeData);
        };
        reader.readAsText(file);
    };





    return (

        <div style={{  height: 3000, width: 1500}} className="container">
        
            <SortableTree
                treeData={treeData}
                onChange={setTreeData}

               
                generateNodeProps={({ node, path }) => ({
                    //title toggle between edit and show
                    title: (
                        <div>
                            {show === path.join('.') ? (
                                <input

                                    onChange={e => setText(e.target.value)}
                                    //on key press enter change the text of the current node
                                    onKeyPress={e => {
                                        if (e.key === "Enter") {
                                            setTreeData(renameNode(treeData, path, text));
                                            setShow(null);
                                        }
                                    }}



                                />
                            ) : (
                                <span
                                    onClick={() => {
                                        setShow(path.join('.'));
                                        setText(node.title);
                                    }}
                                >
                                    {node.title}
                                </span>
                            )}
                        </div>
                    ),

                    buttons: [

                        <button onClick={() => {
                            setTreeData(addChildNode(treeData, path, text));
                        }}
                            style={{
                                marginLeft: "10px",
                                backgroundColor: "green",
                                color: "white",
                                borderRadius: "5px",
                                border: "none",
                                padding: "5px",

                            }}
                        >Add</button>,


                        <button
                            onClick={() => {
                                if (isRootNode(node)) {
                                    alert("You can't delete this node")
                                }
                                else {
                                    setTreeData(deleteNode(treeData, path));
                                }
                            }}


                            style={{
                                marginLeft: "10px",
                                backgroundColor: "red",
                                color: "white",
                                borderRadius: "5px",
                                border: "none",
                                padding: "5px",

                            }}

                        >
                            Delete
                        </button>
                        ,

                        <button
                            onClick={() => {

                                // if its the parent node, it wont be allowed to change the type
                                if (isRootNode(node)) {
                                    alert("You can't change the type of this node")
                                }
                                else {
                                    setTreeData(toggleNodeType(treeData, path));
                                }
                            }}
                            style={{
                                marginLeft: "10px",
                                backgroundColor: "transparent",
                                fontSize: "18px",
                                border: "none",
                                padding: "1px",

                            }}

                        >{node.type === NodeType.BOT ? <span role="img" aria-label="robot">🤖</span> : <span role="img" aria-label="user">🧑🏻</span>}</button>
                        
                    ],

                })}

                canDrag={({ node }) => !isRootNode(node)}
            />
 
            <div style={{ position: "absolute", top: "14px", right: "22px" ,
                 
                borderRadius: "5px",
                border: "none",
                padding: "5px",
                backgroundColor: "black",
        
             }}
             className="export"
             >
                
            <button onClick={exportData}>Export JSON</button>


            <span style={{ marginLeft: "10px" }}></span>

            <button onClick={() => document.getElementById("file").click()}>
                Import JSON
            </button>
            <input

                type="file"
                id="file"
                accept=".json"
                onChange={importData}
                style={{ display: "none" }}
            />
        </div> </div>




    );
}
