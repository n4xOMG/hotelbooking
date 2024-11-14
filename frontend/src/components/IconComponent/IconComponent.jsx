import React from 'react';
import { IconButton } from '@mui/material';
import { Favorite } from '@mui/icons-material';

const IconComponent = () => {
    return (
        <IconButton color="primary" aria-label="add to favorites">
            <Favorite fontSize="large" />
        </IconButton>
    );
};

export default IconComponent;