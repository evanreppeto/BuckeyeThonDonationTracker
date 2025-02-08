import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import Countdown from "react-countdown";
import Leaderboard from "./Leaderboard";
import RecentDonations from "./RecentDonations";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            donations: [],
            pollingCount: 0,
            delay: 5000,
            teamLeaders: [],
            oldDonations: [],
            bigDonationsQueue: [],
            bigDonation: null
        };
    }

    componentDidMount() {
        this.interval = setInterval(this.poll, this.state.delay);
        this.poll();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    poll = () => {
        console.log('Polling for new donations...'); // Debugging log
        this.setState(prevState => ({
            pollingCount: prevState.pollingCount + 1,
            oldDonations: [...prevState.donations]  // Ensure we store a copy, not reference
        }));
        fetch('https://events.dancemarathon.com/api/events/6102/donations?limit=5')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched donations:', data); // Debugging log
                this.setState(prevState => ({
                    donations: data,
                    oldDonations: prevState.donations
                }), () => {
                    console.log('Updated state:', this.state); // Debugging log
                    data.forEach(d => {
                        const shownDonations = JSON.parse(localStorage.getItem('shownDonations')) || [];
                        if (!this.state.oldDonations.map(o => o.donationID).includes(d.donationID) && d.amount >= 50.0 && !shownDonations.includes(d.donationID)) {
                            this.setState(prevState => ({
                                bigDonationsQueue: [...prevState.bigDonationsQueue, d]
                            }), () => {
                                this.showNextBigDonation();
                            });
                            shownDonations.push(d.donationID);
                            localStorage.setItem('shownDonations', JSON.stringify(shownDonations));
                        }
                    });
                });
            });
    }

    showNextBigDonation = () => {
        if (this.state.bigDonationsQueue.length > 0 && !document.getElementById('donationAlert').classList.contains("donationAlertHidden")) {
            const nextBigDonation = this.state.bigDonationsQueue.shift();
            this.setState({ bigDonation: nextBigDonation });
            document.getElementById('donationAlert').classList.remove("donationAlertHidden");
            this.start();
        }
    }

    start() {
        var popup = setInterval(() => {
            document.getElementById('donationAlert').classList.add("donationAlertHidden");
            clearInterval(popup);
            this.showNextBigDonation();
        }, 8000);
    }

    render() {
        console.log('Rendering Dashboard with donations:', this.state.donations); // Debugging log
        return (
            <>
                <Row className="filledRow">
                    <div className="donationTable">
                        <div className="donationAlert donationAlertHidden" id="donationAlert">
                            <h1><strong>{this.state.bigDonation ? this.state.bigDonation.recipientName : "Someone"}</strong> is a hero and raised <strong>${this.state.bigDonation ? this.state.bigDonation.amount.toFixed(2) : 0}</strong>!</h1>
                        </div>
                        <RecentDonations donations={this.state.donations} />
                    </div>
                </Row>
                <Row style={{ display: "inline-block" }}>
                    <br></br>
                    <div className="countdown">
                        <span>🌰 </span>
                        <Countdown date={new Date("Feb 8, 2025 23:00:00")} daysInHours={true} />
                        <span style={{ padding: 0 }}> until BuckeyeThon's reveal!</span>
                        <span> 🌰</span>
                    </div>
                </Row>
                {/* <Row>
                    <div className="">
                        <Leaderboard title={"Test"} leaders={this.state.teamLeaders} />
                    </div>
                </Row>*/}
            </>
        );
    }
}

export default Dashboard;