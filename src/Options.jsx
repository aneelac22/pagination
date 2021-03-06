import React from 'react';
import PropTypes from 'prop-types';
import KEYCODE from './KeyCode';

class Options extends React.Component {
  static propTypes = {
    changeSize: PropTypes.func,
    quickGo: PropTypes.func,
    selectComponentClass: PropTypes.func,
    current: PropTypes.number,
    pageSizeOptions: PropTypes.arrayOf(PropTypes.string),
    pageSize: PropTypes.number,
    buildOptionText: PropTypes.func,
    locale: PropTypes.object,
    rootPrefixCls: PropTypes.string,
    selectPrefixCls: PropTypes.string,
    goButton: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
  };

  static defaultProps = {
    pageSizeOptions: ['10', '20', '30', '40'],
  };

  constructor(props) {
    super(props);

    this.state = {
      goInputText: '',
    };
  }

  buildOptionText = (value) => {
    return `${value} ${this.props.locale.items_per_page}`;
  }

  changeSize = (value) => {
    this.props.changeSize(Number(value));
  }

  handleChange = (e) => {
    this.setState({
      goInputText: e.target.value,
    });
  }

  go = (e) => {
    let val = this.state.goInputText;
    if (val === '') {
      return;
    }
    val = isNaN(val) ? this.props.current : Number(val);
    if (e.keyCode === KEYCODE.ENTER || e.type === 'click') {
      this.setState({
        goInputText: '',
      });
      this.props.quickGo(val);
    }
  }

  render() {
    const {
      pageSize, pageSizeOptions, locale, rootPrefixCls, changeSize,
      quickGo, goButton, selectComponentClass, buildOptionText,
      selectPrefixCls,
    } = this.props;
    const { goInputText } = this.state;
    const prefixCls = `${rootPrefixCls}-options`;
    const Select = selectComponentClass;
    let changeSelect = null;
    let goInput = null;
    let gotoButton = null;

    if (!changeSize && !quickGo) {
      return null;
    }

    if (changeSize && Select) {
      const options = pageSizeOptions.map((opt, i) => (
        <Select.Option key={i} value={opt}>
          {(buildOptionText || this.buildOptionText)(opt)}
        </Select.Option>
      ));

      changeSelect = (
        <Select
          prefixCls={selectPrefixCls}
          showSearch={false}
          className={`${prefixCls}-size-changer`}
          optionLabelProp="children"
          dropdownMatchSelectWidth={false}
          value={(pageSize || pageSizeOptions[0]).toString()}
          onChange={this.changeSize}
          getPopupContainer={triggerNode => triggerNode.parentNode}
        >
          {options}
       </Select>
      );
    }

    if (quickGo) {
      if (goButton) {
        gotoButton = typeof goButton === 'boolean' ? (
          <button
            type="button"
            onClick={this.go}
            onKeyUp={this.go}
          >
            {locale.jump_to_confirm}
          </button>
        ) : (
          <span
            onClick={this.go}
            onKeyUp={this.go}
          >
            {goButton}
          </span>
        );
      }
      goInput = (
        <div className={`${prefixCls}-quick-jumper`}>
          {locale.jump_to}
          <input
            type="text"
            value={goInputText}
            onChange={this.handleChange}
            onKeyUp={this.go}
          />
          {locale.page}
          {gotoButton}
        </div>
      );
    }

    return (
      <li className={`${prefixCls}`}>
        {changeSelect}
        {goInput}
      </li>
    );
  }
}

export default Options;
