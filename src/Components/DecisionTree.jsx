import React, { useState } from 'react';
import SortableTree from 'react-sortable-tree';
import { removeNodeAtPath } from 'react-sortable-tree';
import { addNodeUnderParent } from 'react-sortable-tree';
import { changeNodeAtPath } from 'react-sortable-tree';
import 'react-sortable-tree/style.css';
import 'react-tree-graph/dist/style.css';
import './DecisionTree.css';


export default function DecisionTree() {
    const [treeData, setTreeData] = useState([
        { title: "سلام", superparent: true, children: [], type: "BOT" },
    ]);
    const [text, setText] = useState("default");
    const [show, setShow] = useState();


    const getNodeKey = ({ treeIndex }) => treeIndex;
    const changenewNode = (node, text) => {
        node.title = text;
        return node;
    }
    const exportData = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(treeData)
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

        <div style={{  height: 3000, width: 1500}}>
        
            <SortableTree
                treeData={treeData}
                onChange={treeData => {
                    setTreeData(treeData)
                    console.log(treeData)
                }}
                generateNodeProps={({ node, path }) => ({
                    //title toggle between edit and show
                    title: (
                        <div>
                            {show === path ? (
                                <input

                                    onChange={e => setText(e.target.value)}
                                    //on key press enter change the text of the current node
                                    onKeyPress={e => {
                                        if (e.key === "Enter") {
                                            changeNodeAtPath({
                                                treeData,
                                                path,
                                                getNodeKey,
                                                newNode: changenewNode(node, text),
                                            });
                                            setShow(null);
                                        }
                                    }}



                                />
                            ) : (
                                <span
                                    onClick={() => {
                                        setShow(path);
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
                            setTreeData(addNodeUnderParent({
                                treeData,
                                parentKey: path[path.length - 1],
                                expandParent: true,
                                getNodeKey: ({ treeIndex }) => treeIndex,
                                newNode: {
                                    title: text,
                                    type: "USER",

                                },
                            }).treeData)
                            console.log(treeData)
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
                                if (node.superparent === true) {
                                    alert("You can't delete this node")
                                }
                                else {
                                    setTreeData(removeNodeAtPath({
                                        treeData,
                                        path,
                                        getNodeKey,
                                    }));
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
                                if (node.superparent === true) {
                                    alert("You can't change the type of this node")
                                }
                                else {
                                    // if the node is a BOT node, it will change the type to USER and vice versa
                                    if (node.type === undefined) {
                                        node.type = "BOT"
                                    }

                                    if (node.type === "BOT") {
                                        node.type = "USER"
                                    }
                                    else {
                                        node.type = "BOT"
                                    }

                                    // update the tree
                                    setTreeData(changeNodeAtPath({
                                        treeData,
                                        path,
                                        getNodeKey,
                                        newNode: node,
                                    }));
                                }
                            }}
                            style={{
                                marginLeft: "10px",
                                backgroundColor: "transparent",
                                fontSize: "18px",
                                border: "none",
                                padding: "1px",

                            }}

                        >{node.type === "BOT" ? <span>🤖</span> : <span>🧑🏻</span>}</button>
                    ],

                })}

                canDrag={({ node }) => !node.superparent}
            />
 
            <div style={{ position: "absolute", top: "14px", right: "22px" ,
                 
                borderRadius: "5px",
                border: "none",
                padding: "5px",
                backgroundColor: "black",
        
             }}>
                
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
