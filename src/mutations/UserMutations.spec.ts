import UserMutations from "./UserMutations";
import { EventBus } from "../events/eventBus";
import { UserAuthorization } from "../utils/UserAuthorization";
import { reviewDataSource } from "../datasources/mockups/ReviewDataSource";
import { ApplicationEvent } from "../events/applicationEvents";
import {
  proposalDataSource,
  dummyProposalSubmitted,
  dummyProposal
} from "../datasources/mockups/ProposalDataSource";
import {
  userDataSource,
  dummyUser,
  dummyUserNotOnProposal,
  dummyUserOfficer
} from "../datasources/mockups/UserDataSource";

const jsonwebtoken = require("jsonwebtoken");

const goodToken = jsonwebtoken.sign(
  {
    id: dummyUser.id,
    type: "passwordReset",
    updated: dummyUser.updated
  },
  process.env.secret,
  { expiresIn: "24h" }
);

const badToken = jsonwebtoken.sign(
  {
    id: dummyUser.id,
    updated: dummyUser.updated
  },
  process.env.secret,
  { expiresIn: "-24h" }
);

const dummyEventBus = new EventBus<ApplicationEvent>();
const userAuthorization = new UserAuthorization(
  new userDataSource(),
  new proposalDataSource(),
  new reviewDataSource()
);
const userMutations = new UserMutations(
  new userDataSource(),
  userAuthorization,
  dummyEventBus
);

test("A user can update it's own name", () => {
  return expect(
    userMutations.update(dummyUser, "2", "klara", undefined, undefined)
  ).resolves.toBe(dummyUser);
});

test("A user cannot update another users name", () => {
  return expect(
    userMutations.update(
      dummyUserNotOnProposal,
      "2",
      "klara",
      undefined,
      undefined
    )
  ).resolves.toHaveProperty("reason", "WRONG_PERMISSIONS");
});

test("A not logged in user cannot update another users name", () => {
  return expect(
    userMutations.update(null, "2", "klara", undefined, undefined)
  ).resolves.toHaveProperty("reason", "WRONG_PERMISSIONS");
});

test("A userofficer can update another users name", () => {
  return expect(
    userMutations.update(dummyUserOfficer, "2", "klara", undefined, undefined)
  ).resolves.toBe(dummyUser);
});

test("A user cannot update it's roles", () => {
  return expect(
    userMutations.update(dummyUser, "2", undefined, undefined, [1, 2])
  ).resolves.toHaveProperty("reason", "WRONG_PERMISSIONS");
});

test("A userofficer can update users roles", () => {
  return expect(
    userMutations.update(dummyUserOfficer, "2", undefined, undefined, [1, 2])
  ).resolves.toBe(dummyUser);
});

test("A user should be able to login with credentials and get a token", () => {
  return expect(
    userMutations
      .login(dummyUser.username, "Test1234!")
      .then(data => typeof data)
  ).resolves.toBe("string");
});

test("A user should not be able to login with unvalid credentials", () => {
  return expect(
    userMutations.login(dummyUser.username, "Wrong_Password!")
  ).resolves.toHaveProperty("reason", "WRONG_USERNAME_OR_PASSWORD");
});

test("A user should not be able to update a token if it is unvalid", () => {
  return expect(
    userMutations.token("this_is_a_invalid_token")
  ).resolves.toHaveProperty("reason", "BAD_TOKEN");
});

test("A user should not be able to update a token if it is expired", () => {
  return expect(userMutations.token(badToken)).resolves.toHaveProperty(
    "reason",
    "BAD_TOKEN"
  );
});

test("A user should be able to update a token if valid", () => {
  return expect(
    userMutations.token(goodToken).then(data => typeof data)
  ).resolves.toBe("string");
});

test("A user can reset it's password by providing a valid email", () => {
  return expect(
    userMutations.resetPasswordEmail(dummyUser.email)
  ).resolves.toHaveProperty("user");
});

test("A user get's a error if providing a email not attached to a account", () => {
  return expect(
    userMutations.resetPasswordEmail("dummyemail@ess.se")
  ).resolves.toHaveProperty("reason", "COULD_NOT_FIND_USER_BY_EMAIL");
});

test("A user can update it's password if it has a valid token", () => {
  return expect(
    userMutations.resetPassword(goodToken, "Test1234!")
  ).resolves.toBe(true);
});

test("A user can not update it's password if it has a bad token", () => {
  return expect(
    userMutations.resetPassword(badToken, "Test1234!")
  ).resolves.toBe(false);
});
