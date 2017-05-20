use
mapuiv2

const roles = db.Config.find({name: "roles"}).count();
const permissions = db.Config.find({name: "permissions"}).count();

// check if Roles config is here if not create base roles
if (!roles) {
  db.Config.insert({
    name: "roles",
    data: {
      users: ['admin', 'public', 'user', 'contributor']
    }
  });
}

// check if Permissions config is here if not create base permissions
if (!permissions) {
  db.Config.insert({
    name: "permissions",
    data: {
      admin: ['admin'],
      identifyMovie: ['contributor'],
      identifyTVShow: ['contributor']
    }
  });
}


