import { AccessControl } from "accesscontrol";

// TODO: complete Access Control
let grant = {
  creator: {
    checklistTemplate: {
      "create:own": ["*"],
      "read:own": ["*"],
      "update:own": ["*"],
      "delete:own": ["*"]
    }
  }
  /*guest: {
        checklist: {
            'create:own': ['*', '!rating', '!views'],
            'read:own': ['*'],
            'update:own': ['*', '!rating', '!views'],
            'delete:own': ['*']
        }
    }*/
};

export const ac = new AccessControl(grant);
