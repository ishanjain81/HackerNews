import React,{Component} from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Link } from '@mui/material';
import ReactTimeAgo from 'react-time-ago';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import {Link as Linkto} from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';

class Home extends Component {
    constructor() {

        super();
    
        this.state = {
            news: null,
            currPage: 1,
            parr:[1],
            loading: true,
            value: 1,
            tags: "(story,show_hn,ask_hn)"
        };
    }
    
    async componentDidMount(){
        const res = await axios.get(`http://hn.algolia.com/api/v1/search_by_date?tags=${this.state.tags}&page=${this.state.currPage-1}&hitsPerPage=30`);
        let data = res.data;
        this.setState({
            news: [...data.hits],
            loading: false
        })
        console.log(data.hits[0]);
    }

    changeNews = async () => {
        const res = await axios.get(`http://hn.algolia.com/api/v1/search_by_date?tags=${this.state.tags}&page=${this.state.currPage-1}&hitsPerPage=30`);
        let data = res.data;
        this.setState({
            news: [...data.hits],
            loading: false
        })
    }

    handleRight = () => {
        if(this.state.currPage === this.state.parr.length){
            let temparr = [];
            for(let i=1;i<=this.state.parr.length+1;i++){
                temparr.push(i);
            }
            this.setState({
                parr : [...temparr],
                currPage : this.state.currPage+1,
                loading: true
            },this.changeNews)
        }
        else{
            this.setState({
                currPage : this.state.currPage+1,
                loading: true
            },this.changeNews)
        }
    }
    handleLeft = () =>{
        if(this.state.currPage !== 1){
            this.setState({
                currPage : this.state.currPage - 1,
                loading: true  
            },this.changeNews)
        }
    }

    handleClick = (value) =>{
        if(value !== this.state.currPage){
            this.setState({
                currPage : value,
                loading: true
            },this.changeNews)
        }
    }

    handleTabChange = (num) =>{
        if(num === this.state.value) return;
        this.setState({
            value: num,
            currPage: 1,
            parr:[1],
        });
        if(num === 1){
            this.setState({
                tags: "(story,show_hn,ask_hn)",
                loading: true
            },this.changeNews)
        }
        else if(num === 2){
            this.setState({
                tags: "comment",
                loading: true
            },this.changeNews)
        }
        else if(num === 3){
            this.setState({
                tags: "ask_hn",
                loading: true
            },this.changeNews)
        }
        else if(num === 4){
            this.setState({
                tags: "show_hn",
                loading: true
            },this.changeNews)
        }
        else if(num === 5){
            this.setState({
                tags: "job",
                loading: true
            },this.changeNews)
        }
    }

    render() {
        return(
            <div className="home-container">
                <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                    <Tabs value={this.state.value} aria-label="basic tabs example">
                        <Tab sx={{color: 'black', fontWeight: 600}} label = "Hacker News"/>
                        <Tab onClick={()=>this.handleTabChange(1)} label="New" />
                        <Tab onClick={()=>this.handleTabChange(2)} label="Comments" />
                        <Tab onClick={()=>this.handleTabChange(3)} label="Ask" />
                        <Tab onClick={()=>this.handleTabChange(4)} label="Show" />
                        <Tab onClick={()=>this.handleTabChange(5)} label="Jobs" />
                    </Tabs>
                    <Linkto style={{cursor:'pointer'}} to="/search"><FontAwesomeIcon className="search-icon" icon={faMagnifyingGlass}/></Linkto>
                </Box>
            {
                this.state.loading === true ? 
                <CircularProgress/>:
                <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {
                        this.state.news.map((element,index)=>{
                            return(
                                <ListItem key={element.objectID} sx={{paddingTop: 0, paddingBottom: 0}}>
                                    <ListItemAvatar sx={{minWidth: 20, padding: 0, paddingRight: 1}}>
                                        {
                                            ((this.state.currPage-1) * 30 + index + 1)
                                        }
                                        .
                                    </ListItemAvatar>
                                    {
                                        element.title === null  || element.title === "" ? 
                                        <ListItemText secondary={
                                            <Link sx={{lineHeight: 'auto'}} underline="none" href={element.url} style={{cursor:'pointer', color: 'black'}}><div>{ReactHtmlParser(element.comment_text)}</div></Link>} 
                                            primary={
                                            <>
                                            <div style={{fontSize: '12px'}}>
                                                {element.points === null ? 0 : element.points} points | <Link style={{cursor:'pointer'}} underline='hover'>{element.author}</Link>
                                                &nbsp;|&nbsp; 
                                                <Link style={{cursor:'pointer', color: 'grey'}} underline='hover'><ReactTimeAgo date={Date.parse(element.created_at)} locale="en-US"/></Link>
                                                &nbsp;| on: <Link style={{cursor:'pointer', color: 'grey'}} underline='hover'>{element.story_title}</Link>
                                            </div>
                                            </>
                                        }/>
                                        :
                                        <ListItemText primary={
                                            <Link sx={{lineHeight: 'auto'}} underline="none" href={element.url} style={{cursor:'pointer', color: 'black'}}>{element.title}</Link>} 
                                            secondary={
                                            <>{element.points === null ? 0 : element.points} points by <Link style={{cursor:'pointer'}} underline='hover'>{element.author}</Link>
                                            &nbsp;|&nbsp; 
                                            <Link style={{cursor:'pointer', color: 'grey'}} underline='hover'><ReactTimeAgo date={Date.parse(element.created_at)} locale="en-US"/></Link>
                                            </>
                                        } />
                                    }
                                </ListItem>
                            )
                        })
                    }
                </List>
            }
            <div style={{display:'flex',justifyContent:'center'}}>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li className="page-item"><a className="page-link" onClick={this.handleLeft} style={{cursor:'pointer'}}>Previous</a></li>
                            {
                                this.state.parr.map((value)=>(
                                    value === this.state.currPage ? 
                                    <li className="page-item active" key={value}><a className="page-link" onClick={()=>this.handleClick(value) } style={{cursor:'pointer'}}>{value}</a></li>
                                    :
                                    <li className="page-item" key={value}><a className="page-link" onClick={()=>this.handleClick(value) } style={{cursor:'pointer'}}>{value}</a></li>
                                ))
                            }
                            <li className="page-item"><a className="page-link" onClick={this.handleRight} style={{cursor:'pointer'}}>Next</a></li>
                        </ul>
                    </nav>
            </div>
        </div>
        )
    }
}

export default Home

