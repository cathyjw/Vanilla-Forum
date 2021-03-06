/*
 * @author Stéphane LaFlèche <stephane.l@vanillaforums.com>
 * @copyright 2009-2019 Vanilla Forums Inc.
 * @license GPL-2.0-only
 */

import { ILoadable, LoadStatus } from "@library/@types/api/core";
import apiv2 from "@library/apiv2";
import { t } from "@library/application";
import Button, { ButtonBaseClass } from "@library/components/forms/Button";
import Frame from "@library/components/frame/Frame";
import FrameBody from "@library/components/frame/FrameBody";
import FrameFooter from "@library/components/frame/FrameFooter";
import FrameHeaderWithAction from "@library/components/frame/FrameHeaderWithAction";
import FramePanel from "@library/components/frame/FramePanel";
import FullPageLoader, { LoaderStyle } from "@library/components/FullPageLoader";
import { settings } from "@library/components/icons/header";
import LinkAsButton from "@library/components/LinkAsButton";
import { IMeBoxNotificationItem, MeBoxItemType } from "@library/components/mebox/pieces/MeBoxDropDownItem";
import NotificationsActions from "@library/notifications/NotificationsActions";
import { INotificationsStoreState } from "@library/notifications/NotificationsModel";
import classNames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import MeBoxDropDownItemList from "./MeBoxDropDownItemList";
import { withDevice } from "@library/contexts/DeviceContext";
import { IDeviceProps, Devices } from "@library/components/DeviceChecker";

export interface INotificationsProps {
    countClass?: string;
    panelBodyClass?: string;
}

/**
 * Implements Notifications Contents to be included in drop down or tabs
 */
export class NotificationsContents extends React.Component<IProps> {
    public render() {
        const { userSlug } = this.props;
        const title = t("Notifications");

        return (
            <Frame className={this.props.className}>
                <FrameHeaderWithAction className="hasAction" title={title}>
                    <LinkAsButton
                        title={t("Notification Preferences")}
                        className="headerDropDown-headerButton headerDropDown-notifications button-pushRight"
                        to={`/profile/preferences/${userSlug}`}
                        baseClass={ButtonBaseClass.ICON}
                    >
                        {settings()}
                    </LinkAsButton>
                </FrameHeaderWithAction>
                <FrameBody className={classNames("isSelfPadded", this.props.panelBodyClass)}>
                    <FramePanel>{this.bodyContent()}</FramePanel>
                </FrameBody>
                <FrameFooter>
                    <LinkAsButton
                        className="headerDropDown-footerButton frameFooter-allButton button-pushLeft"
                        to={"/profile/notifications"}
                        baseClass={ButtonBaseClass.TEXT}
                    >
                        {t("All Notifications")}
                    </LinkAsButton>
                    <Button
                        onClick={this.markAllRead}
                        baseClass={ButtonBaseClass.TEXT}
                        className="frameFooter-markRead"
                    >
                        {t("Mark All Read")}
                    </Button>
                </FrameFooter>
            </Frame>
        );
    }

    /**
     * Get content for the main body panel.
     */
    private bodyContent(): JSX.Element {
        const { notifications } = this.props;

        if (notifications.status !== LoadStatus.SUCCESS || !notifications.data) {
            // This is the height that it happens to be right now.
            // This will be calculated better once we finish the CSS in JS transition.
            const height = this.props.device === Devices.MOBILE ? 80 : 69;
            return <FullPageLoader loaderStyle={LoaderStyle.FIXED_SIZE} height={height} minimumTime={0} />;
        }

        return (
            <MeBoxDropDownItemList
                emptyMessage={t("You do not have any notifications yet.")}
                className="headerDropDown-notifications"
                type={MeBoxItemType.NOTIFICATION}
                data={Object.values(notifications.data)}
            />
        );
    }

    public componentDidMount() {
        const { requestData, notifications } = this.props;

        if (notifications.status === LoadStatus.PENDING) {
            void requestData();
        }
    }

    /**
     * Mark all of the current user's notifications as read, then refresh the store of notifications.
     */
    private markAllRead = () => {
        void this.props.markAllRead();
    };
}

// For clarity, I'm adding className separately because both the container and the content have className, but it's not applied to the same element.
interface IOwnProps extends INotificationsProps, IDeviceProps {
    className?: string;
    userSlug: string;
}

type IProps = IOwnProps & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

/**
 * Create action creators on the component, bound to a Redux dispatch function.
 *
 * @param dispatch Redux dispatch function.
 */
function mapDispatchToProps(dispatch) {
    const notificationActions = new NotificationsActions(dispatch, apiv2);
    return {
        markAllRead: notificationActions.markAllRead,
        requestData: notificationActions.getNotifications,
    };
}

/**
 * Update the component state, based on changes to the Redux store.
 *
 * @param state Current Redux store state.
 */
function mapStateToProps(state: INotificationsStoreState) {
    const { notificationsByID } = state.notifications;
    const notifications: ILoadable<IMeBoxNotificationItem[]> = {
        ...notificationsByID,
        data:
            notificationsByID.status === LoadStatus.SUCCESS && notificationsByID.data
                ? Object.values(notificationsByID.data).map(notification => {
                      return {
                          message: notification.body,
                          photo: notification.photoUrl || null,
                          to: notification.url,
                          recordID: notification.notificationID,
                          timestamp: notification.dateUpdated,
                          unread: !notification.read,
                          type: MeBoxItemType.NOTIFICATION,
                      } as IMeBoxNotificationItem;
                  })
                : undefined,
    };

    return {
        notifications,
    };
}

// Connect Redux to the React component.
export default withDevice(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(NotificationsContents),
);
