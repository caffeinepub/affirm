import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type Category = {
    #confidence;
    #gratitude;
    #health;
    #love;
    #success;
    #mindfulness;
  };

  public type Affirmation = {
    id : Nat;
    text : Text;
    category : Category;
    isCustom : Bool;
    authorPrincipal : Principal;
    createdAt : Time.Time;
  };

  public type AffirmationWithFavorite = {
    affirmation : Affirmation;
    isFavorite : Bool;
  };

  public type UserProfile = {
    name : Text;
  };

  module AffirmationWithFavorite {
    public func compare(a1 : AffirmationWithFavorite, a2 : AffirmationWithFavorite) : Order.Order {
      let a1Time = a1.affirmation.createdAt;
      let a2Time = a2.affirmation.createdAt;
      if (a1Time < a2Time) { #less } else if (a1Time > a2Time) { #greater } else {
        Nat.compare(a1.affirmation.id, a2.affirmation.id);
      };
    };
  };

  let affirmations = Map.empty<Nat, Affirmation>();
  let userFavorites = Map.empty<Principal, List.List<Nat>>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextId = 1;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SeedEntry = { text : Text; category : Category };

  let seedData : [SeedEntry] = [
    // Confidence (25)
    { text = "I am powerful beyond fear"; category = #confidence },
    { text = "I am not limited by doubt"; category = #confidence },
    { text = "I am the creator of my reality"; category = #confidence },
    { text = "My inner strength is infinite"; category = #confidence },
    { text = "I stand firm like the eternal Self"; category = #confidence },
    { text = "Nothing external defines me"; category = #confidence },
    { text = "I act with clarity and courage"; category = #confidence },
    { text = "I trust my inner intelligence"; category = #confidence },
    { text = "I am fearless in action"; category = #confidence },
    { text = "My presence commands respect"; category = #confidence },
    { text = "I am grounded in truth"; category = #confidence },
    { text = "I rise above uncertainty"; category = #confidence },
    { text = "My mind is steady and sharp"; category = #confidence },
    { text = "I carry divine strength within me"; category = #confidence },
    { text = "I am unshakable in my purpose"; category = #confidence },
    { text = "I move forward with certainty"; category = #confidence },
    { text = "I am aligned with universal power"; category = #confidence },
    { text = "I act without hesitation"; category = #confidence },
    { text = "I am confident in every step"; category = #confidence },
    { text = "My willpower is strong"; category = #confidence },
    { text = "I overcome every challenge"; category = #confidence },
    { text = "I trust myself completely"; category = #confidence },
    { text = "I am bold and decisive"; category = #confidence },
    { text = "I radiate confidence naturally"; category = #confidence },
    { text = "I am enough as I am"; category = #confidence },
    // Gratitude (10)
    { text = "I am grateful for this present moment"; category = #gratitude },
    { text = "My heart overflows with thankfulness"; category = #gratitude },
    { text = "I appreciate the beauty in every day"; category = #gratitude },
    { text = "Gratitude opens the door to abundance"; category = #gratitude },
    { text = "I am thankful for all that I have"; category = #gratitude },
    { text = "Every experience is a gift I am grateful for"; category = #gratitude },
    { text = "I choose to focus on what is good in my life"; category = #gratitude },
    { text = "I am thankful for the lessons in my journey"; category = #gratitude },
    { text = "My gratitude transforms my perspective"; category = #gratitude },
    { text = "I live in a state of deep appreciation"; category = #gratitude },
    // Health (10)
    { text = "My body is healthy and full of energy"; category = #health },
    { text = "I nourish my body with love and care"; category = #health },
    { text = "Every cell in my body vibrates with health"; category = #health },
    { text = "I am getting stronger every day"; category = #health },
    { text = "My mind and body are in perfect balance"; category = #health },
    { text = "I choose habits that support my well-being"; category = #health },
    { text = "I am grateful for my strong and capable body"; category = #health },
    { text = "Health and vitality flow through me"; category = #health },
    { text = "I rest deeply and wake up refreshed"; category = #health },
    { text = "I honor my body as a sacred vessel"; category = #health },
    // Love (10)
    { text = "I am worthy of deep and lasting love"; category = #love },
    { text = "Love flows freely to me and through me"; category = #love },
    { text = "I attract loving and supportive relationships"; category = #love },
    { text = "I give and receive love effortlessly"; category = #love },
    { text = "My heart is open to giving and receiving love"; category = #love },
    { text = "I am surrounded by love in all its forms"; category = #love },
    { text = "I love myself unconditionally"; category = #love },
    { text = "Love is my natural state of being"; category = #love },
    { text = "I deserve kindness and compassion"; category = #love },
    { text = "I nurture deep and meaningful connections"; category = #love },
    // Success (10)
    { text = "I am on the path to extraordinary success"; category = #success },
    { text = "Every step I take leads me closer to my goals"; category = #success },
    { text = "I have the skills to achieve anything I desire"; category = #success },
    { text = "Success flows naturally into my life"; category = #success },
    { text = "I attract opportunities that align with my purpose"; category = #success },
    { text = "I am fully committed to my vision"; category = #success },
    { text = "My actions create consistent progress"; category = #success },
    { text = "I welcome abundance into every area of my life"; category = #success },
    { text = "I turn challenges into stepping stones"; category = #success },
    { text = "My potential for success is unlimited"; category = #success },
    // Mindfulness (10)
    { text = "I am fully present in this moment"; category = #mindfulness },
    { text = "I observe my thoughts without judgment"; category = #mindfulness },
    { text = "Peace lives within me always"; category = #mindfulness },
    { text = "I breathe in calm and breathe out tension"; category = #mindfulness },
    { text = "I am aware, awake, and alive"; category = #mindfulness },
    { text = "This moment is exactly where I need to be"; category = #mindfulness },
    { text = "I release what I cannot control"; category = #mindfulness },
    { text = "My mind is clear and my heart is at ease"; category = #mindfulness },
    { text = "I find stillness in the midst of movement"; category = #mindfulness },
    { text = "I am at peace with who I am and where I am"; category = #mindfulness },
  ];

  // Seed built-in affirmations
  system func preupgrade() {
    affirmations.clear();
    let system_ = Principal.fromText("aaaaa-aa");
    let baseTime = Time.now();
    var i = 0;
    for (entry in seedData.vals()) {
      i += 1;
      let affirmation : Affirmation = {
        id = i;
        text = entry.text;
        category = entry.category;
        isCustom = false;
        authorPrincipal = system_;
        createdAt = baseTime - Int.abs(seedData.size() - i) * 60 * 1_000_000_000;
      };
      affirmations.add(i, affirmation);
    };
    nextId := i + 1;
  };

  // Helper function to check if an affirmation is favorited by a user
  private func isFavoritedBy(affirmationId : Nat, user : Principal) : Bool {
    switch (userFavorites.get(user)) {
      case (null) { false };
      case (?favorites) {
        favorites.any(func(id) { id == affirmationId });
      };
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Affirmation Management
  public query ({ caller }) func getAllByCategory(category : Category) : async [AffirmationWithFavorite] {
    let allAffirmations = affirmations.values().toArray();
    let filtered = allAffirmations.filter(
      func(a) {
        a.category == category;
      }
    );
    filtered.map(
      func(a) {
        {
          affirmation = a;
          isFavorite = isFavoritedBy(a.id, caller);
        };
      }
    );
  };

  public shared ({ caller }) func toggleFavorite(affirmationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can favorite affirmations");
    };

    switch (affirmations.get(affirmationId)) {
      case (null) { Runtime.trap("Affirmation not found") };
      case (?_) {
        let currentFavorites = switch (userFavorites.get(caller)) {
          case (null) { List.empty<Nat>() };
          case (?list) { list };
        };
        let isAlreadyFavorite = currentFavorites.any(
          func(id) { id == affirmationId }
        );
        if (isAlreadyFavorite) {
          let newFavorites = currentFavorites.filter(
            func(id) { id != affirmationId }
          );
          userFavorites.add(caller, newFavorites);
        } else {
          currentFavorites.add(affirmationId);
          userFavorites.add(caller, currentFavorites);
        };
      };
    };
  };

  public shared ({ caller }) func create(text : Text, category : Category) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create affirmations");
    };

    let affirmation : Affirmation = {
      id = nextId;
      text;
      category;
      isCustom = true;
      authorPrincipal = caller;
      createdAt = Time.now();
    };
    affirmations.add(nextId, affirmation);
    nextId += 1;
    affirmation.id;
  };

  public shared ({ caller }) func update(affirmationId : Nat, newText : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update affirmations");
    };

    switch (affirmations.get(affirmationId)) {
      case (null) { Runtime.trap("Affirmation not found") };
      case (?affirmation) {
        if (affirmation.authorPrincipal != caller) {
          Runtime.trap("Unauthorized: Can only update your own affirmations");
        };
        let updatedAffirmation = {
          affirmation with
          text = newText;
        };
        affirmations.add(affirmationId, updatedAffirmation);
      };
    };
  };

  public shared ({ caller }) func delete(affirmationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete affirmations");
    };

    switch (affirmations.get(affirmationId)) {
      case (null) { Runtime.trap("Affirmation not found") };
      case (?affirmation) {
        if (affirmation.authorPrincipal != caller) {
          Runtime.trap("Unauthorized: Can only delete your own affirmations");
        };
        affirmations.remove(affirmationId);
      };
    };
  };

  public query ({ caller }) func getFavorites() : async [AffirmationWithFavorite] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access favorites");
    };

    switch (userFavorites.get(caller)) {
      case (null) { return [] };
      case (?favorites) {
        let favoriteIds = favorites.toArray();
        let favoriteAffirmations = favoriteIds.map(
          func(id) {
            switch (affirmations.get(id)) {
              case (null) { null };
              case (?affirmation) {
                ?{
                  affirmation;
                  isFavorite = true;
                };
              };
            };
          }
        );
        favoriteAffirmations.filterMap(func(a) { a }).sort();
      };
    };
  };

  public query ({ caller }) func getCustomAffirmations() : async [AffirmationWithFavorite] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access custom affirmations");
    };

    let allAffirmations = affirmations.values().toArray();
    let customAffirmations = allAffirmations.filter(
      func(a) {
        a.isCustom and a.authorPrincipal == caller;
      }
    );
    customAffirmations.map(
      func(a) {
        {
          affirmation = a;
          isFavorite = isFavoritedBy(a.id, caller);
        };
      }
    );
  };

  public query ({ caller }) func getDailyAffirmation() : async AffirmationWithFavorite {
    let today = (Time.now() / (24 * 60 * 60 * 1_000_000_000)).toNat();
    let allAffirmations = affirmations.values().toArray();
    if (allAffirmations.size() == 0) {
      Runtime.trap("No affirmations available");
    };
    let index = today % allAffirmations.size();
    {
      affirmation = allAffirmations[index];
      isFavorite = isFavoritedBy(allAffirmations[index].id, caller);
    };
  };

  public query func getAllAffirmations() : async [AffirmationWithFavorite] {
    let allAffirmations = affirmations.values().toArray();
    allAffirmations.map(
      func(a) {
        {
          affirmation = a;
          isFavorite = false;
        };
      }
    );
  };
};
