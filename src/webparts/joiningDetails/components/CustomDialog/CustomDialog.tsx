import { extend, random } from "@microsoft/sp-lodash-subset";
import * as React from "react";
import { Modal, ContextualMenu, IconButton, IDragOptions, PrimaryButton, getTheme, mergeStyleSets, IStyleSet, IIconProps, FontWeights, ICustomizableProps } from "office-ui-fabric-react";
export interface ICustomDialogProps {
    isModalOpen: boolean;
    heading: string;
    hideModal: () => {};
}
export interface ICustomDialogState {

}
export class CustomDialog extends React.Component<ICustomDialogProps, ICustomDialogState>{

   public dialogToggleStyles: any;
   public dialogContentStyles: any;
   public dialogIconButtonStyles: any;
   public  cancelIcon: IIconProps = { iconName: 'Cancel' };
   public dragOptions: IDragOptions = {
        moveMenuItemText: 'Move',
        closeMenuItemText: 'Close',
        menu: ContextualMenu,
    };
    constructor(props: ICustomDialogProps) {
        super(props);
        this.setDialogStyles();
        this.state = {};

    }
    public setDialogStyles() {
        const theme = getTheme();
        this.dialogContentStyles = mergeStyleSets({
            container: {
                display: 'flex',
                flexFlow: 'column nowrap',
                alignItems: 'stretch',
            },
            header: [
                // eslint-disable-next-line deprecation/deprecation
                theme.fonts.xLargePlus,
                {
                    flex: '1 1 auto',
                    borderTop: `4px solid ${theme.palette.themePrimary}`,
                    color: theme.palette.neutralPrimary,
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: FontWeights.semibold,
                    padding: '12px 12px 14px 24px',
                },
            ],
            body: {
                flex: '4 4 auto',
                padding: '0 24px 24px 24px',
                overflowY: 'hidden',
                selectors: {
                    p: { margin: '14px 0' },
                    'p:first-child': { marginTop: 0 },
                    'p:last-child': { marginBottom: 0 },
                },
            },
        });
        this.dialogToggleStyles = { root: { marginBottom: '20px' } };
        this.dialogIconButtonStyles = {
            root: {
                color: theme.palette.neutralPrimary,
                marginLeft: 'auto',
                marginTop: '4px',
                marginRight: '2px',
            },
            rootHovered: {
                color: theme.palette.neutralDark,
            },
        };
    }
    public render(): React.ReactElement<ICustomDialogState> {
        let titleId: string = "dialog" + random();
        return (
            <Modal
                containerClassName={this.dialogContentStyles.container}
                titleAriaId={titleId}
                isOpen={this.props.isModalOpen}
                onDismiss={this.props.hideModal}
                isBlocking={false}

                dragOptions={this.dragOptions}
            >
              
                <div className={this.dialogContentStyles.header}>
                    <span id={titleId}>{this.props.heading}</span>
                    <IconButton
                        styles={this.dialogIconButtonStyles}
                        iconProps={this.cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={this.props.hideModal}
                    />

                </div>
                
                <div className={this.dialogContentStyles.body}>
                    {this.props.children}
                </div>
            </Modal>
        );
    }
}