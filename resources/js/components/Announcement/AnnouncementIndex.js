import React from 'react';
import ServerTable from 'react-strap-table';
import { AiFillDelete, AiFillEdit, AiOutlineRead, AiFillPlusSquare, AiFillMinusSquare } from "react-icons/ai";
import { Link } from "react-router-dom";
import Spinner from "../Spinner";
import {
    Header,
} from "semantic-ui-react";

class AnnouncementIndex extends React.Component {
    state = {
        selectedAnnouncements: [],
        announcementsIDs: [],
        isAllChecked: false,
        deleting: false,
        loading: false,
    };

    check_all = React.createRef();

    handleCheckboxTableChange = (event) => {
        const value = event.target.value;
        let selectedAnnouncements = this.state.selectedAnnouncements.slice();

        selectedAnnouncements.includes(value) ?
            selectedAnnouncements.splice(selectedAnnouncements.indexOf(value), 1) :
            selectedAnnouncements.push(value);

        this.setState({ selectedAnnouncements: selectedAnnouncements }, () => {
            this.check_all.current.checked = _.difference(this.state.announcementsIDs, this.state.selectedAnnouncements).length === 0;
        });
    }

    handleCheckboxTableAllChange = (event) => {
        this.setState({ selectedAnnouncements: [...new Set(this.state.selectedAnnouncements.concat(this.state.announcementsIDs))] }, () => {
            this.check_all.current.checked = _.difference(this.state.announcementsIDs, this.state.selectedAnnouncements).length === 0;
        });
    }

    handleDelete = async (id) => {
        this.setState({ deleting: true })
        const res = await axios.put(`/users/deleteAnnouncement/${id}`);
        if (res.data.status === 200) {
            this.setState({ deleting: false })
        }
    };

    handleDeleteMany = async () => {
        this.setState({ deleting: true })
        const { selectedAnnouncements } = this.state
        let selectedAnnouncementIds = selectedAnnouncements.map(Number);
        const res = await axios.put(`/users/deleteAnnouncements`, {
            selectedAnnouncementIds: selectedAnnouncementIds
        });
        if (res.data.status === 200) {
            this.setState({ deleting: false })
        }
    }

    handleRead = async (id) => {
        this.setState({ loading: true });
        const res = await axios.put(`/users/readAnnouncement/${id}`);
        if (res.data.status === 200) {
            this.setState({ loading: false });
            this.props.history.push("/announcementsunread");
        }
    }

    handleUnread = async (id) => {
        this.setState({ loading: true });
        const res = await axios.put(`/users/unreadAnnouncement/${id}`);
        if (res.data.status === 200) {
            this.setState({ loading: false });
            this.props.history.push("/announcementsread");
        }
    }


    render() {
        const { deleting, loading } = this.state;
        let self = this;
        let read = this.props.read;
        let title = "Unread announcements"
        if (read === 1) { title = "Read announcements" }
        const url = 'http://localhost:8000/announcements?read=' + read;
        const columns = ['id', 'name', 'description', 'assignees', 'actions']
        let checkAllInput = (<input type="checkbox" ref={this.check_all} onChange={this.handleCheckboxTableAllChange} />);
        const options = {
            perPage: 5,
            perPageValues: [5, 10, 20, 25, 100],
            headings: { id: checkAllInput, created_at: 'Created At' },
            sortable: ['name', 'description', 'assignees'],
            columnsWidth: { name: 20, description: 20, id: 5 },
            columnsAlign: { id: 'center' },
            requestParametersNames: { query: 'search', direction: 'order' },
            responseAdapter: function (res) {
                let announcementsIDs = res.data.map(a => a.id.toString());
                self.setState({ announcementsIDs: announcementsIDs }, () => {
                    self.check_all.current.checked = _.difference(self.state.announcementsIDs, self.state.selectedAnnouncements).length === 0;
                });

                return { data: res.data, total: res.total }
            },
            texts: {
                show: "Announcements"
            },
        };

        return (
            <div>
                <button className="btn btn-primary create" style={{ marginRight: "8px" }}>
                    <Link to={'announcements/create'}>
                        <div style={{ color: "white" }} >
                            <AiFillPlusSquare color="white" size="20" />
                            <span style={{ marginLeft: "8px" }} >
                                Create
                            </span>
                        </div>
                    </Link>
                </button>
                <button className="btn btn-danger delete" onClick={() => { self.handleDeleteMany() }}>
                    <div style={{ color: "white" }} >
                        <AiFillMinusSquare color="white" size="20" />
                        <span style={{ marginLeft: "8px" }} >
                            Delete Many
                        </span>
                    </div>
                </button>
                <Header as="h1" icon color="black" textAlign="left">
                    {title}
                </Header>
                {
                    deleting ? <Spinner /> : loading ? <Spinner text="loading" /> :
                        <ServerTable columns={columns} url={url} options={options} bordered hover updateUrl>
                            {
                                function (row, column) {
                                    switch (column) {
                                        case 'id':
                                            return (
                                                <input key={row.id.toString()} type="checkbox" value={row.id.toString()}
                                                    onChange={self.handleCheckboxTableChange}
                                                    checked={self.state.selectedAnnouncements.includes(row.id.toString())} />
                                            );
                                        case 'description':
                                            return (
                                                <div dangerouslySetInnerHTML={{ __html: `${row.description}` }} />
                                            )
                                        case 'actions':
                                            return (
                                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                    <button className="btn btn-primary" style={{ marginRight: "5px" }}>
                                                        <Link to={'announcements/' + row.id + '/edit'}>
                                                            <AiFillEdit color="white" />
                                                            <div style={{ color: "white" }} >
                                                                Edit
                                                            </div>
                                                        </Link>
                                                    </button>
                                                    {read === 1 ? <button className="btn btn-success" style={{ marginRight: "5px" }} onClick={() => { self.handleUnread(row.id) }}>
                                                        <AiOutlineRead color="white" />
                                                        <div style={{ color: "white" }} >
                                                            Unread
                                                        </div>
                                                    </button> : <button className="btn btn-success" style={{ marginRight: "5px" }} onClick={() => { self.handleRead(row.id) }}>
                                                        <AiOutlineRead color="white" />
                                                        <div style={{ color: "white" }} >
                                                            read
                                                        </div>
                                                    </button>}
                                                    <button className="btn btn-danger" style={{ marginLeft: "5px" }} onClick={() => { self.handleDelete(row.id) }}>
                                                        <AiFillDelete color="white" />
                                                        <div style={{ color: "white" }}>
                                                            Delete
                                                        </div>
                                                    </button>
                                                </div>

                                            );
                                        default:
                                            return (row[column]);
                                    }
                                }
                            }
                        </ServerTable >
                }</div>
        );
    }
}

export default AnnouncementIndex;