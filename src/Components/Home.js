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

class Home extends Component {
    constructor() {
        
        super();
    
        this.state = {
            news: null,
            currPage: 1,
            parr:[1],
            loading: true
        };
    }
    
    async componentDidMount(){
        const res = await axios.get(`http://hn.algolia.com/api/v1/search_by_date?tags=(story,show_hn,ask_hn)&page=${this.state.currPage-1}&hitsPerPage=30`);
        let data = res.data;
        this.setState({
            news: [...data.hits],
            loading: false
        })
        console.log(data.hits[0]);
    }

    changeNews = async () => {
        const res = await axios.get(`http://hn.algolia.com/api/v1/search_by_date?tags=(story,show_hn,ask_hn)&page=${this.state.currPage-1}&hitsPerPage=30`);
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

    render() {
        let value = 1;
        return(
            <div className="home-container">
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} aria-label="basic tabs example">
                        <Tab label = "Hacker News"/>
                        <Tab label="New" />
                        <Tab label="Past" />
                        <Tab label="Comments" />
                    </Tabs>
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
                                    <ListItemText primary={
                                        <Link sx={{lineHeight: 'auto'}} underline="none" href={element.url} style={{cursor:'pointer', color: 'black'}}>{element.title}</Link>} 
                                        secondary={
                                        <>{element.points} points by <Link style={{cursor:'pointer'}} underline='hover'>{element.author}</Link></>
                                    } />
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

