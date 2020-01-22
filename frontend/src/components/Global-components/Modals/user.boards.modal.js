import React, { Component } from 'react';
import { MDBIcon, MDBLink } from 'mdbreact';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// import { loginRequest } from '../actions/user.action';


// Import css and components for it
import './Modals.css';
import BoardsTitle from '../board/boardsTitle';
import CommonBoard from '../board/CommonBoard';


class BoardsModal extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: '',
			boards: {},
			theme: {},
			starredBoard: {},
			recentedBoard: {},
			starToggleFlag: true,
			recentToggleFlag: true,
			personToggleFlag: true
		}

	}

	componentWillMount() {
		
		const boards = this.props.user.user.boards;
		const newState = this.props.starredStatus;

		// Insert recented boards from boards
		let recentedBoard = [];
		let compareKey = 0;
		let flag = false;
		boards.map(value => {

			if (value.recented > compareKey) {
				recentedBoard.push(value);
				compareKey = value.recented;
			} else {
				flag = false;
				recentedBoard.map((data, key) => {
					if (data.recented > value.recented && flag == false) {
						recentedBoard.splice(key, 0, value);
						flag = true;
					}
				});
			}
			
		});
		
		// Updata starred of boards
		boards.map((value, i) => {
			if (value.boardid == newState.boardid) {
				value.starred = newState.starStatus;
			}
		});

		// Insert starred boards from boards
		let starredBoard = [];
		boards.map((value, i) => {
			if (value.starred) {
				starredBoard.push(value);
			}
		});
		
		this.setState({
			boards: boards,
			id: this.props.user.user.id,
			starredBoard: starredBoard,
			theme: this.props.theme.themeData,
			recentedBoard: recentedBoard
		});
	}

	componentWillReceiveProps(newProps) {

		const starredBoard = this.state.starredBoard;
		const boards = this.state.boards;
		const newBoards = newProps.user.user.boards;
		console.log(newProps.windowFlag)
		
		// Update starredBoard
		if (newProps.starredStatus.starStatus == true) {
			boards.map(data => {
				if (data.boardid == newProps.starredStatus.boardid) {
					data.starred = newProps.starredStatus.starStatus;
					starredBoard.push(data);
				}
			});
			this.setState({
				starredBoard: starredBoard
			});
		} else {
			boards.map(data => {
				if (data.boardid == newProps.starredStatus.boardid) {
					data.starred = newProps.starredStatus.starStatus;
				}
			});
			this.setState({
				starredBoard: starredBoard.filter(el => el.boardid !== newProps.starredStatus.boardid )
			});
			 
		}

		// Update recentedBoard
		let recentedBoard = [];
		let compareKey = 0;
		let flag = false;
		newBoards.map(value => {
			if (value.recented > compareKey) {
				recentedBoard.push(value);
				compareKey = value.recented;
			} else {
				flag = false;
				recentedBoard.map((data, key) => {
					if (data.recented > value.recented && flag == false) {
						recentedBoard.splice(key, 0, value);
						flag = true;
					}
				});
			}
			
		});
		this.setState({
			recentedBoard: recentedBoard
		});

		// Check Flag star/recent/person
		if (newProps.toggleFlag.compareKey == "star") {
			this.setState({
				starToggleFlag: newProps.toggleFlag.reserveFlag
			});
		} else if (newProps.toggleFlag.compareKey == "recent") {
			this.setState({
				recentToggleFlag: newProps.toggleFlag.reserveFlag
			});
		} else {
			this.setState({
				personToggleFlag: newProps.toggleFlag.reserveFlag
			});
		}

	}

	render() {
		const { starredBoard, boards, theme, recentedBoard } = this.state;
		const regex = /bk/;
		return (
			<div className="boards-modal">
				<input className="search-boards" type="text" placeholder="Find boards by name…" />

				{/*Starred boards*/}
					<BoardsTitle compareKey="star" title="starred boards" icon="star" />
					
					{
						(this.state.starToggleFlag) ?
							(starredBoard.length !== 0) ?
								<div className="each-area">
									{
										starredBoard.map((value, i) => {
											if (regex.test(value.themeTitle)) {
												return theme[1].map(data => {
													if (value.themeTitle.substring(2) == data.no) {
														return <CommonBoard starred={value.starred} title={value.title}  boardid={value.boardid} bk={data.url} />
													}
												})
											} else {
												return theme[0].map(data => {
													if (value.themeTitle.substring(2) == data.no) {
														return <CommonBoard starred={value.starred} title={value.title}  boardid={value.boardid} bk={data.color} />
													}
												})
											}
										})
									}	

								</div>
							:
								<div className="starred-empty">
									Star your most important boards to keep them right at your fingertips.
								</div>
						:
							<div className="hidden"></div>
					}

					
					
				{/*Recented boards*/}
					{
						(boards.length !== starredBoard.length) ?
						<>
							<BoardsTitle compareKey="recent" title="recent boards" icon="clock" />
							{
								(this.state.recentToggleFlag) ?
									<div className="each-area">
										{
											recentedBoard.map((value, i) => {
												if (!value.starred) {
													if (regex.test(value.themeTitle)) {
														return theme[1].map(data => {
															if (value.themeTitle.substring(2) == data.no) {
																return <CommonBoard starred={value.starred} title={value.title}  boardid={value.boardid} bk={data.url} />
															}
														})
													} else {
														return theme[0].map(data => {
															if (value.themeTitle.substring(2) == data.no) {
																return <CommonBoard starred={value.starred} title={value.title}  boardid={value.boardid} bk={data.color} />
															}
														})
													}
												}
											})
										}
									</div>
								:
									<div className="hidden"></div>
							}	
								
						</>
						:
							<div className="hidden"></div>
					}
					
				{/*Personal boards*/}
					<BoardsTitle compareKey="person" title="Personal boards" icon="user" />
						{
							(this.state.personToggleFlag) ?
								<div className="each-area">
									{
											boards.map((value, i) => {
												if(regex.test(value.themeTitle)) {
													return theme[1].map(data => {
														if (value.themeTitle.substring(2) == data.no) {
															return <CommonBoard starred={value.starred} title={value.title} boardid={value.boardid} bk={data.url} />
														}
													})
												} else {
													return theme[0].map(data => {
														if (value.themeTitle.substring(2) == data.no) {
															return <CommonBoard starred={value.starred} title={value.title} boardid={value.boardid} bk={data.color} />
														}
													})
												}
											})
										}
								</div>
							:
								<div className="hidden"></div>
						}
						
				{/*Other functionality*/}
					<MDBLink className="other-link">
						<span>
							Create new board…
						</span>
					</MDBLink>
					<MDBLink className="other-link">
						<span>
							Always keep this menu open.
						</span>
					</MDBLink>
					<MDBLink className="other-link">
						<span>
							See closed boards…
						</span>
					</MDBLink>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  user: state.user,
  starredStatus: state.starred,
  theme: state.theme,
  toggleFlag: state.toggleFlag
});

// const mapDispatchToProps = (dispatch) => {
//   return bindActionCreators({
//     loginRequest
//   }, dispatch);
// }

export default connect(mapStateToProps)(BoardsModal);
