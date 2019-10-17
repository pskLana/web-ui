import React from 'react';
import {Button, ButtonDropdown, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, Spinner, Table} from "reactstrap";
import {FaRedo, FaThLarge, FaThList} from "react-icons/fa";
import ShortView from "../dataset/ShortView";
import LongView from "../dataset/LongView";
import FiltersView from '../filter/FiltersView';

import {connect} from 'react-redux';
import * as actionCreators from '../../../../store/actions/index';

import axios from '../../../../webservice/axios-dataSets';
import FilterView from "../filter/fileterView";

class TableView extends React.Component {

    state = {
        dropdownOpen: false,

        listOrderByValues: ['title', 'issue date', 'theme'],
        selectedOrder: 0,

        isLongView: true,

        isTooltipNumberOfDataSetsOpen: false,
        isTooltipDataSetsOpen: false,

        screenWidth: 0,

        filters: [],//[{title: t1, values: [{label: l, value: v, uri: u}]},{...},...]
        selectedFilters: [] //is like [{title: "t", uri: "uri", values: ["v1", "v2"]}]
    };

    async componentDidMount() {
        this.props.onFetchingDataSets(this.props.searchKey, this.props.selectedSearchIn, this.props.selectedFilters);
        this.props.onGettingNumberOfDataSets(this.props.searchKey, this.props.selectedSearchIn, this.props.selectedFilters);
        await this.onFetchFilters();
        this.handleWindowSizeChange();
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    onFetchFilters = () => {
        axios.get('/filters/list')
            .then(response => {
                    console.log(response);
                    // const data = response.data;
                    // console.log(data);
                    const data = [
                        {
                            title: "t1",
                            values: [
                                {label: "label_t1_11", value: "label_t1_v1", uri: "label_t1_uri1"},
                                {label: "label_t1_12", value: "label_t1_v2", uri: "label_t1_uri2"},
                                {label: "label_t1_13", value: "label_t1_v3", uri: "label_t1_uri3"}
                            ]

                        }, {
                            title: "t2",
                            values: [
                                {label: "label_t2_11", value: "label_t2_v1", uri: "label_t2_uri1"},
                                {label: "label_t2_12", value: "label_t2_v2", uri: "label_t2_uri2"},
                                {label: "label_t2_13", value: "label_t2_v3", uri: "label_t2_uri3"}
                            ]

                        }, {
                            title: "t3",
                            values: [
                                {label: "label_t3_11", value: "label_t3_v1", uri: "label_t3_uri1"},
                                {label: "label_t3_12", value: "label_t3_v2", uri: "label_t3_uri2"},
                                {label: "label_t3_13", value: "label_t3_v3", uri: "label_t3_uri3"}
                            ]

                        },
                    ];
                    // console.log(data);
                    this.setState({filters: data});
                }
            ).catch(error => console.log(error));
    };

    onAppendSelectedValues = (title, value, label) => {
        console.log(title + ": " + value + " :" + label);
        let selectedFilters = [...this.state.selectedFilters];
        const selectedFilter = selectedFilters.find(f => f.title === title && f.uri === 'later');
        console.log(selectedFilter);
        if(selectedFilter) {
            let find = selectedFilter.values.find(v => v === value);
            if(find)
                selectedFilter.values = selectedFilter.values.filter(v => v !== value);//remove it
            else
                selectedFilter.values.push(value);
        } else {
           selectedFilters.push({title: title, uri:'later', values:[value]}) //todo
        }
        this.setState({selectedFilters: selectedFilters});
        console.log(selectedFilters);

    };

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    };

    orderByChanged = (idx) => {
        let newState = {...this.state};
        newState.selectedOrder = idx;
        this.setState(newState);
    };

    largeViewChanged = () => {
        let newState = {...this.state};
        newState.isLongView = !newState.isLongView;
        this.setState(newState);
    };

    load10More = () => {
        if (this.props.dataSets !== null && this.props.dataSets.length > 0)
            this.props.onLoad10More(this.props.searchKey, this.props.selectedSearchIn, this.props.dataSets.length, this.props.selectedFilters);
    };

    applyFilters = () => {
        this.props.onFetchingDataSets(this.props.searchKey, this.props.selectedSearchIn, this.props.selectedFilters);
        this.props.onGettingNumberOfDataSets(this.props.searchKey, this.props.selectedSearchIn, this.props.selectedFilters);
    };

    reloadNumberOfDataSets = () => {
        this.setState({
            isTooltipNumberOfDataSetsOpen: false
        });
        this.props.onGettingNumberOfDataSets(this.props.searchKey, this.props.selectedSearchIn, this.props.selectedFilters);

    };

    reloadDataSets = () => {
        this.setState({
            isTooltipDataSetsOpen: false
        });
        this.props.onFetchingDataSets(this.props.searchKey, this.props.selectedSearchIn, this.props.selectedFilters);
    };

    toggleToolTipNumberOfDataSets = () => {
        this.setState({
            isTooltipNumberOfDataSetsOpen: !this.state.isTooltipNumberOfDataSetsOpen
        });
    };

    toggleToolTipDataSets = () => {
        this.setState({
            isTooltipDataSetsOpen: !this.state.isTooltipDataSetsOpen
        });
    };

    toggleFilters = () => {
        if (this.props.isFiltersOpen) {
            this.props.onPushLastSelectedValues(this.props.lastSelectedValues);
        }
        this.props.onToggleFilters(!this.props.isFiltersOpen);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({screenWidth: window.innerWidth});
    };

    render() {
        let numberOfResult = null;
        if (this.props.loadingNumberOfDataSetsError)
            numberOfResult =
                <div>
                    <Button onClick={this.reloadNumberOfDataSets}><FaRedo
                        id="TooltipNumberOfDataSetsFetchError"/></Button>
                    <span style={{marginLeft: '3px', fontSize: '8px', fontWeight: '500'}}>Error in Fetching number of datasets from the server</span>
                </div>;
        else if (this.props.loadingNumberOfDataSets)
            numberOfResult = <Spinner color="primary"/>;
        else if (this.props.numberOfDataSets !== null)
            if (this.props.numberOfDataSets === -1)
                numberOfResult =
                    <div>
                        <Button onClick={this.reloadNumberOfDataSets}><FaRedo
                            id="TooltipNumberOfDataSetsInternalServerError"/></Button>
                        <span
                            style={{marginLeft: '3px', fontSize: '8px', fontWeight: '500'}}>Internal Server Error</span>
                    </div>;
            else
                numberOfResult = this.props.numberOfDataSets;

        let dataSets = null;
        if (this.props.loadingDataSetsError)
            dataSets =
                <div>
                    <Button onClick={this.reloadDataSets}><FaRedo id="ToolTipDataSets"/></Button>
                    <span style={{marginLeft: '3px', fontSize: '8px', fontWeight: '500'}}>Error in Fetching dataSets from the server</span>
                </div>;
        else if (this.props.loadingDataSets)
            dataSets = <Spinner type="grow" color="primary"/>;
        else if (this.props.dataSets !== null)
            dataSets = this.props.dataSets.map(
                dataSet => (
                    <Col md={{size: 12}} key={dataSet.uri}>
                        {this.state.isLongView ? <LongView dataSet={dataSet}/> : <ShortView dataSet={dataSet}/>}
                    </Col>
                )
            );

        //let filterView = this.props.filters ?
        // <FiltersView filters={this.props.filters} applyFilters={this.applyFilters}/> : <Spinner color="primary"/>;

        const isMobile = this.state.screenWidth <= 700;

        return (
            <Col md={{size: 12}}>
                <Row>
                    <Col xs={isMobile ? {size: 12} : {size: 9}}>
                        <Table hover bordered responsive striped style={{display: 'block'}}>
                            <thead>
                            <tr>
                                <th style={{width: '1%'}}>
                                    <div style={{display: 'flex', flexFlow: 'row wrap'}}>
                                        <span> {numberOfResult} </span>
                                        <div style={{flexGrow: 1}}/>
                                        <Button style={{marginLeft: '2px'}}> Export</Button>
                                        <Button style={{marginLeft: '2px'}} onClick={this.largeViewChanged}>
                                            {this.state.isLongView ? <FaThLarge/> : <FaThList/>}
                                        </Button>
                                        <ButtonDropdown style={{marginLeft: '2px'}} isOpen={this.state.dropdownOpen}
                                                        toggle={this.toggle}>
                                            <DropdownToggle caret>
                                                {this.state.listOrderByValues[this.state.selectedOrder]}
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                {
                                                    this.state.listOrderByValues.map((orderBy, idx) => {
                                                        return <DropdownItem onClick={() => this.orderByChanged(idx)}
                                                                             active={idx === this.state.selectedOrder}
                                                                             key={idx}>{orderBy}</DropdownItem>
                                                    })
                                                }
                                            </DropdownMenu>
                                        </ButtonDropdown>
                                        {isMobile ? <Button style={{marginLeft: '2px'}}
                                                            onClick={this.toggleFilters}>Filters</Button> : ''}
                                        {this.props.isFiltersOpen && isMobile ? <div className="dropdown-menu" style={{
                                            top: '17%',
                                            display: 'block',
                                            left: '4%',
                                            width: '90%'
                                        }}>
                                            <FiltersView applyFilters={this.applyFilters}/>
                                        </div> : ''}
                                    </div>

                                </th>
                            </tr>
                            </thead>
                            <tbody style={isMobile ? {
                                    display: 'block',
                                    height: '300px',
                                    'overflowX': 'hidden',
                                    width: '100%'
                                } :
                                {display: 'block', 'overflowX': 'hidden', width: '100%'}}>
                            <tr style={{display: 'block'}}>
                                <td style={{display: 'block'}}>
                                    {dataSets}
                                    <Row style={{'paddingTop': '1rem'}}>
                                        <Button className="mx-auto" style={{marginBottom: '1rem'}}
                                                onClick={this.load10More} disabled={this.props.dataSets === null}> Load
                                            10 more </Button>
                                    </Row>
                                </td>
                            </tr>
                            </tbody>
                        </Table>

                    </Col>
                    {
                        !isMobile &&
                        <Col style={{'paddingLeft': '0'}} xs={{size: 3}}>
                            <div style={{position: 'fixed', width: '23%'}}>
                                <FiltersView filters={this.state.filters} selectedFilters={this.state.selectedFilters}
                                             onAppendSelectedValues={this.onAppendSelectedValues}
                                             applyFilters={this.applyFilters}
                                />
                            </div>
                        </Col>
                    }
                </Row>

            </Col>
        )
    }
}

const mapStateToProps = state => {
    return {
        dataSets: state.ds.dataSets,
        loadingDataSets: state.ds.loadingDataSets,
        loadingDataSetsError: state.ds.loadingDataSetsError,

        numberOfDataSets: state.ds.numberOfDataSets,
        loadingNumberOfDataSets: state.ds.loadingNumberOfDataSets,
        loadingNumberOfDataSetsError: state.ds.loadingNumberOfDataSetsError,

        filters: state.filters.filters,
        selectedFilters: state.filters.selectedFilters,

        searchKey: state.searchKey.key,
        searchIn: state.searchKey.searchIn,
        selectedSearchIn: state.searchKey.selectedSearchIn,
        isFiltersOpen: state.filters.isFiltersOpen,
        lastSelectedValues: state.filters.lastSelectedValues,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFetchingDataSets: (searchKey, searchIn, selectedFilters) =>
            dispatch(actionCreators.fetchDataSets(searchKey, searchIn, selectedFilters)),
        onGettingNumberOfDataSets: (searchKey, searchIn, selectedFilters) =>
            dispatch(actionCreators.getNumberOfDataSets(searchKey, searchIn, selectedFilters)),
        onLoad10More: (searchKey, searchIn, low, selectedFilters) =>
            dispatch(actionCreators.load10More(searchKey, searchIn, low, selectedFilters)),
        onFetchFilters: () => dispatch(actionCreators.fetchFilters()),
        onToggleFilters: (isFiltersOpen) => dispatch(actionCreators.toggleFilters(isFiltersOpen)),
        onPushLastSelectedValues: (lastSelectedValues) => dispatch(actionCreators.pushLastSelectedValues(lastSelectedValues)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(TableView);