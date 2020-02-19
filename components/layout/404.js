import React from 'react';
import {css} from '@emotion/core';

const NotFound = () => {
    return (<h1 css={css`
                margin-top: 5rem;
                text-align: center;
                color: #F00
            `}>Error 404 - Pagína no encontrada</h1>);
}
 
export default NotFound;