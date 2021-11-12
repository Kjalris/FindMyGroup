import { NativeStackScreenProps } from '@react-navigation/native-stack';
import axios from 'axios';
import React from 'react';
import { Alert, Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Group } from '../interfaces/group.interface';
import { url } from '../constants/api.constant';
import { deleteGroup, deleteGroupMember } from '../helpers/api';
import Toast from 'react-native-toast-message';
import { createWarning } from '../helpers/toast';
import { Member } from '../interfaces/member.interface';

export default class GroupScreen extends React.Component<
  NativeStackScreenProps<
    {
      Group: {
        group: Group;
        member: Member;
        isOwner: boolean;
      };
      QRCreate: {
        group: Group;
      };
    },
    'Group'
  >,
  { group: Group }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      group: this.props.route.params.group,
    };
  }

  render() {
    return (
      <SafeAreaView>
        <Text>Hello</Text>
        <Button
          title="View QR code"
          onPress={() => {
            this.props.navigation.navigate('QRCreate', {
              group: this.state.group,
            });
          }}
        />
        {this.props.route.params.isOwner && (
          <Button
            title="Delete group"
            onPress={() => {
              Alert.alert('Are you sure?', 'This action is permanent', [
                {
                  text: 'Yes',
                  style: 'destructive',
                  onPress: () => {
                    deleteGroup(this.props.route.params.group.id)
                      .then(() => {
                        this.props.navigation.goBack();
                      })
                      .catch((err) => {
                        createWarning(
                          'Delete group',
                          'Failed to delete group (' + err.message + ')',
                        );
                        return;
                      });
                  },
                },
                {
                  text: 'No',
                  style: 'cancel',
                },
              ]);
            }}
          />
        )}
        {!this.props.route.params.isOwner && (
          <Button
            title="Leave group"
            onPress={() => {
              Alert.alert(
                'Are you sure?',
                'You can always join the group again',
                [
                  {
                    text: 'Yes',
                    style: 'destructive',
                    onPress: () => {
                      deleteGroupMember(
                        this.props.route.params.group.id,
                        this.props.route.params.member.id,
                      )
                        .then(() => {
                          this.props.navigation.goBack();
                        })
                        .catch((err) => {
                          createWarning(
                            'Leave group',
                            'Failed to leave group (' + err.message + ')',
                          );
                          return;
                        });
                    },
                  },
                  {
                    text: 'No',
                    style: 'cancel',
                  },
                ],
              );
            }}
          />
        )}
        <Toast position={'top'} ref={(ref) => Toast.setRef(ref)} />
      </SafeAreaView>
    );
  }
}
