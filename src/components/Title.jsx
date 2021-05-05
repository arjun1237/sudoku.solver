import React from 'react'
import styles from '../css/grid.module.css'
import tStyles from '../css/title.module.css'

function Title({textClr, msg}){
    return (
        <h2 className={styles[textClr] + " " + tStyles["btn-title"]}>{msg}</h2>
    )
}

export default Title