import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";

class AutoCompleteInput extends Component {
    static propTypes = {
        suggestions: PropTypes.instanceOf(Array)
    };

    static defaultProps = {
        suggestions: []
    };

    constructor(props) {
        super(props);

        this.state = {
            // The active selection's index
            activeSuggestion: 0,
            // The suggestions that match the user's input
            filteredSuggestions: [],
            // Whether or not the suggestion list is shown
            showSuggestions: false,
            // What the user has entered
            userInput: props.defaultValue
        };
    }

    componentDidMount = () => {
        const b = document;
        const self = this;
        b.addEventListener("click", function (e) {
            let id = e.target.id;           
            console.log(e.target.id);
            if (id !== "autocompleteinput" && id !== "autocompletesuggestion") {
                console.log('hgiii');
                self.setState({
                    activeSuggestion: 0,
                    filteredSuggestions: [],
                    showSuggestions: false
                });
            }
        });
    }

    onFocus = e =>{
        const { suggestions } = this.props;
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions:suggestions,
            showSuggestions: true,
            userInput: e.currentTarget.value
        });
    }

    onChange = e => {
        const { suggestions } = this.props;
        const userInput = e.currentTarget.value;
        this.props.setValue(e.currentTarget.value);

        // Filter our suggestions that don't contain the user's input
        // const filteredSuggestions = suggestions.filter(
        //     suggestion =>
        //         suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
        // );
        const filteredSuggestions = suggestions;
        if(suggestions.filter(ele=>ele===userInput).length<=0 && userInput.length>0){
            this.setState({
                activeSuggestion: 0,
                filteredSuggestions:[],
                showSuggestions: false,
                userInput: e.currentTarget.value
            });
        }else{
            this.setState({
                activeSuggestion: 0,
                filteredSuggestions,
                showSuggestions: true,
                userInput: e.currentTarget.value
            });
        }       
    };

    onClick = e => {
        this.props.setValue(e.currentTarget.innerText);
        this.setState({
            activeSuggestion: 0,
            filteredSuggestions: [],
            showSuggestions: false,
            userInput: e.currentTarget.innerText
        });
    };

    onKeyDown = e => {
        const { activeSuggestion, filteredSuggestions } = this.state;

        // User pressed the enter key
        if (e.keyCode === 13) {
            this.setState({
                activeSuggestion: 0,
                showSuggestions: false,
                userInput: filteredSuggestions[activeSuggestion]
            });
        }
        // User pressed the up arrow
        else if (e.keyCode === 38) {
            if (activeSuggestion === 0) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion - 1 });
        }
        // User pressed the down arrow
        else if (e.keyCode === 40) {
            if (activeSuggestion - 1 === filteredSuggestions.length) {
                return;
            }

            this.setState({ activeSuggestion: activeSuggestion + 1 });
        }
    };

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            onFocus,
            state: {
                activeSuggestion,
                filteredSuggestions,
                showSuggestions,
                userInput
            }
        } = this;

        let suggestionsListComponent;

        if (showSuggestions) {
            if (filteredSuggestions.length) {
                suggestionsListComponent = (
                    <ul class="suggestions">
                        {filteredSuggestions.map((suggestion, index) => {
                            let className;

                            // Flag the active suggestion with a class
                            if (index === activeSuggestion) {
                                className = "suggestion-active";
                            }

                            return (
                                <li className={className} key={suggestion} id="autocompletesuggestion" onClick={onClick}>
                                    {suggestion}
                                </li>
                            );
                        })}
                    </ul>
                );
            }
            //    else {
            //     suggestionsListComponent = (
            //       <div class="no-suggestions">
            //         {/* <em>No suggestions, you're on your own!</em> */}
            //       </div>
            //     );
            //   }
        }

        return (
            <div className="autocomplete" id="autocomplete">
                <input
                    id="autocompleteinput"
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    onFocus={e => onFocus(e)}
                    value={userInput}
                    required
                />
                {suggestionsListComponent}
                <i class="fa fa-chevron-down dropdown-icon" aria-hidden="true"></i>
            </div>
        );
    }
}

export default AutoCompleteInput;
