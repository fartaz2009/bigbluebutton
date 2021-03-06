import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RedisPubSub from '/imports/startup/server/redis';

export default function toggleLockSettings(credentials, lockSettingsProps) {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'ChangeLockSettingsInMeetingCmdMsg';

  const { meetingId, requesterUserId } = credentials;

  check(meetingId, String);
  check(requesterUserId, String);
  check(lockSettingsProps, {
    disableCam: Boolean,
    disableMic: Boolean,
    disablePrivateChat: Boolean,
    disablePublicChat: Boolean,
    disableNote: Boolean,
    hideUserList: Boolean,
    lockedLayout: Boolean,
    lockOnJoin: Boolean,
    lockOnJoinConfigurable: Boolean,
    setBy: Match.Maybe(String),
  });

  const {
    disableCam,
    disableMic,
    disablePrivateChat: disablePrivChat,
    disablePublicChat: disablePubChat,
    disableNote,
    hideUserList,
    lockedLayout,
    lockOnJoin,
    lockOnJoinConfigurable,
  } = lockSettingsProps;

  const payload = {
    disableCam,
    disableMic,
    disablePrivChat,
    disablePubChat,
    disableNote,
    hideUserList,
    lockedLayout,
    lockOnJoin,
    lockOnJoinConfigurable,
    setBy: requesterUserId,
  };

  RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
}
