import React from 'react';

const TextArea = props => {

    let formControl = "form-control";
	
    if (!props.valid) {
        formControl = 'form-control control-error';
    }
    
    return (
        <div className="form-group">
            <textarea type="text" className={formControl} {...props} />
        </div>
    );
}

export default TextArea;