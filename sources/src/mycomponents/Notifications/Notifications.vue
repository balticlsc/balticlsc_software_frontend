<template>
  <div class="row" >
    <div class="col-sm-4 offset-sm-7" style="position: absolute;z-index:99;">
      <div v-if="notifications.length > 4" class="alert alert-dismissible fade show alert-warning" @click="removeAllNotifications()"> 
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        Remove all notifications
      </div>
      <div v-for="notification in notifications" :id="notification.id" :key="notification.id">
        <div class="alert alert-dismissible fade show" :class="notification.type">
          <button type="button" class="close" data-dismiss="alert" @click="removeNotification(notification.id)">&times;</button>
          {{notification.msg}}
          <span v-if="notification.debug">
            <button class="btn btn-link btn-sm" type="button" data-toggle="collapse" :data-target="'#body'+notification.id" aria-expanded="false" aria-controls="'body'+notification.id">
										Details ...
					  </button>
            <div class="collapse" :id="'body'+notification.id">
              <div class="card card-body">
                {{ notification.debug }}
              </div>
            </div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./Notifications.js"></script>
