import React from 'react';
import BaseIcon from '../BaseIcon';
import { mdiEye, mdiTrashCan, mdiPencilOutline } from '@mdi/js';
import axios from 'axios';
import {
    GridActionsCellItem,
    GridRowParams,
    GridValueGetterParams,
} from '@mui/x-data-grid';
import ImageField from '../ImageField';
import {saveFile} from "../../helpers/fileSaver";
import dataFormatter from '../../helpers/dataFormatter'
import DataGridMultiSelect from "../DataGridMultiSelect";
import ListActionsPopover from '../ListActionsPopover';

import {hasPermission} from "../../helpers/userPermissions";

type Params = (id: string) => void;

export const loadColumns = async (
    onDelete: Params,
    entityName: string,
    
    user
    
) => {
    async function callOptionsApi(entityName: string) {
        
        if (!hasPermission(user, 'READ_' + entityName.toUpperCase())) return [];
        
        try {
        const data = await axios(`/${entityName}/autocomplete?limit=100`);
        return data.data;
        } catch (error) {
         console.log(error);
         return [];
        }
    }
    
    const hasUpdatePermission = hasPermission(user, 'UPDATE_DOCUMENTS')
    
    return [
        
        {
            field: 'organization',
            headerName: 'Organization',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            sortable: false,
            type: 'singleSelect',
            getOptionValue: (value: any) => value?.id,
            getOptionLabel: (value: any) => value?.label,
            valueOptions: await callOptionsApi('organizations'),
            valueGetter: (params: GridValueGetterParams) =>
                params?.value?.id ?? params?.value,
          
        },
        
        {
            field: 'case',
            headerName: 'Case',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            sortable: false,
            type: 'singleSelect',
            getOptionValue: (value: any) => value?.id,
            getOptionLabel: (value: any) => value?.label,
            valueOptions: await callOptionsApi('cases'),
            valueGetter: (params: GridValueGetterParams) =>
                params?.value?.id ?? params?.value,
          
        },
        
        {
            field: 'uploaded_by_user',
            headerName: 'UploadedBy',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            sortable: false,
            type: 'singleSelect',
            getOptionValue: (value: any) => value?.id,
            getOptionLabel: (value: any) => value?.label,
            valueOptions: await callOptionsApi('users'),
            valueGetter: (params: GridValueGetterParams) =>
                params?.value?.id ?? params?.value,
          
        },
        
        {
            field: 'category',
            headerName: 'Category',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'description',
            headerName: 'Description',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'file',
            headerName: 'File',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            editable: false,
            sortable: false,
            renderCell: (params: GridValueGetterParams) => (
              <>
                {dataFormatter.filesFormatter(params.row.file).map(link => (
                  <button
                      key={link.publicUrl}
                      onClick={(e) => saveFile(e, link.publicUrl, link.name)}
                  >
                    {link.name}
                  </button>
                ))}
              </>
            ),
          
        },
        
        {
            field: 'is_confidential',
            headerName: 'IsConfidential',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            type: 'boolean',
          
        },
        
        {
            field: 'received_at',
            headerName: 'ReceivedAt',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            type: 'dateTime',
            valueGetter: (params: GridValueGetterParams) =>
                new Date(params.row.received_at),
          
        },
        
        {
            field: 'actions',
            type: 'actions',
            minWidth: 30,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
            getActions: (params: GridRowParams) => {
                
               return [
                   <div key={params?.row?.id}>
                      <ListActionsPopover
                      onDelete={onDelete}
                      itemId={params?.row?.id}
                      pathEdit={`/documents/documents-edit/?id=${params?.row?.id}`}
                      pathView={`/documents/documents-view/?id=${params?.row?.id}`}
                      
                      hasUpdatePermission={hasUpdatePermission}
                      
                    />
                   </div>,
                  ]
            },
        },
    ];
};
