import * as actionTypes from './actionTypes';
import axios from '../../../webservice/axios-dataSets';

export const fetchDataSetsStart = () => {
    return {
        type: actionTypes.FETCH_DATASETS_START
    };
};

export const fetchDataSetsSuccess = (dataSets ) => {
    return {
        type: actionTypes.FETCH_DATASETS_SUCCESS,
        dataSets: dataSets
    };
};

export const fetchDataSetsFail = (error ) => {
    return {
        type: actionTypes.FETCH_DATASETS_FAIL,
        error: error
    };
};

export const fetchDataSets = (searchKey, searchIn, /*todo orderBy, */selectedFilters) => {
    return dispatch => {
        dispatch(fetchDataSetsStart());
        axios.post(`/dataSets/getSubList?searchQuery=${searchKey}&searchIn=${searchIn}`, selectedFilters)
            .then( response => {
                const dataSets = response.data;
                dispatch(fetchDataSetsSuccess(dataSets));
            } )
            .catch( err => {
                dispatch(fetchDataSetsFail(err));
            } );
    };
};


export const getNumberOfDataSetsStart = () => {
    return {
        type: actionTypes.GET_NUMBER_DATASETS_START
    }
};
export const getNumberOfDataSetsSuccess = (num) => {
    return {
        type: actionTypes.GET_NUMBER_DATASETS_SUCCESS,
        numberOfDataSets: num
    }
};
export const getNumberOfDataSetsFail = (error) => {
    return {
        type: actionTypes.GET_NUMBER_DATASETS_FAIL,
        error: error
    }
};

export const getNumberOfDataSets = (searchKey, searchIn, /*todo orderBy, */selectedFilters) => {
    return dispatch => {
        dispatch(getNumberOfDataSetsStart());
        axios.post(`/dataSets/getNumberOfDataSets?searchQuery=${searchKey}&searchIn=${searchIn}`, selectedFilters)
            .then( response => {
                const numberOfDataSets = response.data;
                dispatch(getNumberOfDataSetsSuccess(numberOfDataSets));
            } )
            .catch( err => {
                dispatch(getNumberOfDataSetsFail(err));
            } );
    };
};


export const load10MoreSuccess = (dataSets) => {
    return {
        type: actionTypes.LOAD_10_MORE,
        additionalDataSets: dataSets
    };
};

export const load10More = (searchKey, searchIn, /*todo orderBy, */low, selectedFilters) => {
    return dispatch => {
        axios.post(`/dataSets/getSubList?searchQuery=${searchKey}&searchIn=${searchIn}&low=${low}`, selectedFilters)
            .then(response => {
                let dataSets = response.data;
                dispatch(load10MoreSuccess(dataSets));
            });
    };
};