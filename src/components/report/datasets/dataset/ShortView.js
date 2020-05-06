import React from 'react';
import {Badge, Button, Input, Card, CardBody, CardHeader, CardSubtitle, CardTitle} from "reactstrap";
import {FaExpandArrowsAlt, FaExternalLinkAlt, FaRegStar, FaStar, FaStarHalfAlt} from "react-icons/fa";
import ModalDatasetView from "./ModalDatasetView";
import Link from 'next/link';

class ShortView extends React.Component {

    state = {
        isOneLineDescription: true,
        isModalOpen: false
    };

    oneLineDescriptionClicked = () => {
        let newState = {...this.state};
        newState.isOneLineDescription = !newState.isOneLineDescription;
        this.setState(newState);
    };

    toggleModal = () => {
        const isModalOpen = !this.state.isModalOpen;
        this.setState({isModalOpen: isModalOpen});
    };

    render() {

        const title = this.props.dataSet.title ? this.props.dataSet.title : "";

        let description = this.props.dataSet.description ? this.props.dataSet.description: "";
        if (this.state.isOneLineDescription) description = description.substr(0, 100);

        // todo uncomment me when overall rating is available
        let overallRatingStarts = <span />;
        // let overallRating = this.props.dataSet.overallRating;
        // const rating = [0, 0, 0, 0, 0];
        // for (let i = 1; i <= overallRating; i++)
        //     rating[i - 1] = 2;
        // if (overallRating - Math.floor(overallRating) >= 0.5)
        //     rating[Math.floor(overallRating)] = 1;
        // let overallRatingStarts = (<span>
        //     {
        //         rating.map((r, idx) => r === 0 ? <FaRegStar key={idx}/> : r === 1 ? <FaStarHalfAlt key={idx}/> :
        //             <FaStar key={idx}/>)
        //     }
        // </span>);

        const dataSetViewLink = "./view/datasetView?uri=" + this.props.dataSet.uri;

        return (
            <Card color="LightCard" style={{flexGrow: '1', marginTop:'1em'}}>
                {
                    this.state.isModalOpen &&
                    <ModalDatasetView
                        isModalOpen={this.state.isModalOpen}
                        onToggleModal={() => this.toggleModal()}
                        uri={this.props.dataSet.uri}
                    />
                }
                <CardHeader>
                    <div style={{display: 'flex', flexFlow: 'row wrap'}}>
                        <CardTitle style={{display: 'inline', marginLeft: '0.5em', fontWeight: 'bold'}}>
                            {title}
                        </CardTitle>
                        <div style={{flexGrow: '1'}}/>
                        {overallRatingStarts}
                        <Button size="sm"
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'gray',
                                    marginLeft: '2px'
                                }}
                                onClick={() => this.toggleModal()}
                        >
                            <FaExpandArrowsAlt/>
                        </Button>
                        <Link href={dataSetViewLink}>
                            <a target="_blank" style={{textDecoration: "none", color: 'gray'}}>
                                <FaExternalLinkAlt/>
                            </a>
                        </Link>
                    </div>
                </CardHeader>
                <CardBody>
                    <CardSubtitle> {description}
                        {
                            (this.props.dataSet.description && this.props.dataSet.description.length > 100) &&
                            <Button color="link" onClick={this.oneLineDescriptionClicked}>
                                {this.state.isOneLineDescription ? 'more' : 'less'}
                            </Button>
                        }
                    </CardSubtitle>
                </CardBody>
            </Card>
        );
    }
}

export default ShortView;