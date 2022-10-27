

import React, { useState } from 'react';
import SortableTree from 'react-sortable-tree';
import {removeNodeAtPath} from 'react-sortable-tree';
import { addNodeUnderParent } from 'react-sortable-tree';
import {changeNodeAtPath} from 'react-sortable-tree';
import 'react-sortable-tree/style.css'; 
import 'react-tree-graph/dist/style.css';
 
 
export default function DecisionTree() {
    const [treeData, setTreeData] = useState([
        { title:"سلام", superparent:true, children: [] },
    ]);
    const [text, setText] = useState("default");
    const [show, setShow] = useState();
 

    const getNodeKey = ({ treeIndex }) => treeIndex;
    const changenewNode=(node,text)=>{
        node.title=text;
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
   

 
    
    return (
        <div style={{ height: 750, width: 1000 }}>
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
                   //button to delete node only if it is not superparent

                    <button
                        onClick={() => {
                            if(node.superparent===true){
                                alert("you can't delete this node")
                            }
                            else{
                            setTreeData(removeNodeAtPath({
                                treeData,
                                path,
                                getNodeKey,
                            }));
                        }
                        }}
                      

                        style={{marginLeft:"10px",
                        backgroundColor:"green",
                        color:"white",
                        borderRadius:"5px",
                        border:"none",
                        padding:"5px",
                        
                    }}
                        
                    >
                        Delete
                    </button>,

                    <button onClick={() => {
                        setTreeData(addNodeUnderParent({
                            treeData,
                            parentKey: path[path.length - 1],
                            expandParent: true,
                            getNodeKey: ({ treeIndex }) => treeIndex,
                            newNode: {
                                title: text,
                            },
                        }).treeData)
                        console.log(treeData)
                    }}
                    style={{marginLeft:"10px",
                    backgroundColor:"green",
                    color:"white",
                    borderRadius:"5px",
                    border:"none",
                    padding:"5px",
                    
                }}
                    >add</button>,
                    ,

                ],
            })}
          
            canDrag={({ node }) => !node.superparent  }
       


        />
        {/* button to generate the tree using Tree */}
        <button onClick={exportData}>generate</button>
   
    
      
       




        </div>
 
       

    );
    }
