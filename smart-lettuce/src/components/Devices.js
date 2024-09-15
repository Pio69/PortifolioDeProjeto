import React from "react";
import {Table} from "react-bootstrap";

class Devices extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            devices : []
        }
    }

    render(){
        return (
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Opcoes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>SmartLab</td>
                        <td>Atualizar  Excluir</td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}

export default Devices;