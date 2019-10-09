import React from 'react'
import { getIcon } from '../../../../utils/app'
// Todo: create style.js file instead of style jsx and inmport it here

class RadioButton extends React.Component {
  render () {
    return (
      <div>
        <div className='radioContainer' >
          <label className={this.props.className}>{this.props.label}
            <input className='radioButton' type='radio' label={this.props.label} name={this.props.name} value={this.props.value} onChange={this.props.onChange} checked={this.props.checked} />
            <span className='checkmark' />
          </label>
          <style jsx>{`
        .radioContainer {
            width: 100%;
            position: relative;
            display: inline-block;
        }
        label{
            line-height: 60px;
            cursor: pointer;
            width:100%;
            display: inline-block;
        }
        .checkmark {
            cursor: pointer;
            margin-top: 20px;
            margin-right: 15px;
            float: right;
            height: 20px;
            width: 20px;
            background-color: #eee;
            border-radius: 50%;
        }
        input:checked ~ .checkmark {
            background: url(${getIcon('ic_checkbox_selected.svg')}), 0px center no-repeat;
        }
        input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
        }
        
        .labelTextColor: {
            color: '#9e9e9e';
            fontWeight: 900px;
            
        }
        
    `}</style>
        </div>
      </div>
    )
  }
}

export default RadioButton
