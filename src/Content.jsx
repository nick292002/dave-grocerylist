import React, { useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'

const Content = ({ items, handleCheck, handleDelete }) => {

    return (
        <>
            {items.length ? (
                <ul>
                    {items.map((item) => (
                        <li className="item" key={item.id}>
                            <input
                                type="checkbox"
                                onChange={() => handleCheck(item.id)}
                                checked={item.checked}
                            />
                            <label
                                style={(item.checked) ? { textDecoration: 'line-through' } : null}
                                onDoubleClick={() => handleCheck(item.id)}
                            >{item.item}
                            </label>
                            <FaTrashAlt
                                onClick={() => handleDelete(item.id)}
                                role="button"
                                tableindex="0"
                                aria-label={"Delete"}
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <h2>List is Empty</h2>
            )}
        </>
    )
}

export default Content
