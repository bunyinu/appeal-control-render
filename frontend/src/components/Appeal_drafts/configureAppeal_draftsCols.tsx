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
    
    const hasUpdatePermission = hasPermission(user, 'UPDATE_APPEAL_DRAFTS')
    
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
            field: 'author_user',
            headerName: 'Author',
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
            field: 'status',
            headerName: 'Status',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'content',
            headerName: 'Content',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            
        },
        
        {
            field: 'attachments',
            headerName: 'Attachments',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            editable: false,
            sortable: false,
            renderCell: (params: GridValueGetterParams) => (
              <>
                {dataFormatter.filesFormatter(params.row.attachments).map(link => (
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
            field: 'submitted_at',
            headerName: 'SubmittedAt',
            flex: 1,
            minWidth: 120,
            filterable: false,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
          
            
            editable: hasUpdatePermission,
            
            type: 'dateTime',
            valueGetter: (params: GridValueGetterParams) =>
                new Date(params.row.submitted_at),
          
        },
        
        {
            field: 'actions',
            type: 'actions',
            minWidth: 30,
            headerClassName: 'datagrid--header',
            cellClassName: 'datagrid--cell',
            getActions: (params: GridRowParams) => {
                
               return [
                   params.row.status !== 'submitted' ? <GridActionsCellItem
                     key="submit"
                     icon={<BaseIcon path={mdiEye} size="18" />}
                     label="Submit"
                     onClick={async () => {
                          if (window.confirm('Submit this draft?')) {
                             await axios.put('/cases/' + (params.row.case?.id || params.row.case) + '/submit-appeal', { data: { draftId: params.row.id } });
                             window.location.reload();
                          }
                     }}
                     showInMenu
                   /> : <div key="ph"></div>,
                   <div key={params?.row?.id}>
                      <ListActionsPopover
                      onDelete={onDelete}
                      itemId={params?.row?.id}
                      pathEdit={`/appeal_drafts/appeal_drafts-edit/?id=${params?.row?.id}`}
                      pathView={`/appeal_drafts/appeal_drafts-view/?id=${params?.row?.id}`}
                      
                      hasUpdatePermission={hasUpdatePermission}
                      
                    />
                   </div>,
                  ]
            },
        },
    ];
};
