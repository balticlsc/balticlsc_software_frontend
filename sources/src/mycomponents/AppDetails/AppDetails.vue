<template>
	<div>
		<div class="modal" id="delete-module">
			<div class="modal-dialog">
				<div class="modal-content">

					<div class="modal-header">
						<h5 class="modal-title">Delete app. Are you sure?</h5>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<div class="modal-body">
						<div class="alert alert-danger" role="alert">
							You are about to delete this app. Are you sure ?
						</div>
					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal" @click="deleteModule">Delete</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>

		<!-- The Modal for App release  -->
		<div class="modal" id="createAppRelease">
			<div class="modal-dialog">
				<div class="modal-content">

					<!-- Modal Header -->
					<div class="modal-header">
							<h4 class="modal-title">Create new application release ... </h4>
							<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<!-- Modal body -->
					<div class="modal-body">
						<div class="form-group">
							<label for="app_release_version_name_id" >Version :</label>
							<input type="text" class="form-control" id="app_release_version_name_id" 
									:class  = "{'is-invalid': validateRelease && releaseName != null && releaseName.trim().length < 1 }"
									@blur   = "validateRelease = true"
									v-model = "releaseName" 
									aria-describedby="emailHelp" placeholder="Enter version  ... ">
							<div class="invalid-feedback">A non empty version description is required</div>
						</div>
						
					</div>

					<!-- Modal footer -->
					<div class="modal-footer">
						<button type="button" class="btn btn-primary" @click="createAppReleaseClicked()">Create</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>

		<div class="modal" id="delete-module-release">
			<div class="modal-dialog">
				<div class="modal-content">

					<div class="modal-header">
						<h5 class="modal-title">Delete app release {{currRelease != null ? currRelease.version:""}}. Are you sure?</h5>
						<button type="button" class="close" data-dismiss="modal">&times;</button>
					</div>

					<div class="modal-body">
						<div class="alert alert-danger" role="alert">
							You are about to delete this app release - id = {{currRelease != null ? currRelease.uid :""}}.<br/> Are you sure ?
						</div>
					</div>

					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal" @click="deleteModuleRelease">Delete</button>
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
					</div>

				</div>
			</div>
		</div>

		<div class="row app card shadow" :id="app.id">

			<div class="col-md-12  " style="background: white;">

				<div class="row">
					<div class="col-md-11" >
						<div class="media h-100 w-100 py-2" >
							<img :src="app.icon" class="mr-3 " alt="" style= "height: 100px; width: 100px;">
							<div class="media-body">
								<div>
									<h2 class="mt-0">
										{{ app.name }}
									</h2>
								</div>

								<div>
									<!--<span :id="app.authorId">
										By 
										<router-link :to="{ name: 'Person', params: {personId: app.authorId } }">
											{{ app.authorFullName }}
										</router-link>
									</span>
									<span> &bull; </span> -->
									<span>
										Updated on {{ app._lastUpdateDate | moment("MMMM Do YYYY, HH:mm") }}
									</span>
								</div>

								<div>
									{{ app.longDescription }}
								</div>

								<div>
									<span class="badge badge-secondary" style="margin-right: 5px;" v-for="keyword in app.keywords" v-bind:key="keyword">{{ keyword }}</span>
								</div>
							</div>
						</div>
					</div>

					<div class="col-md-1 " style="background: white;margin-top: 10px;">
						<div class="row ">
							<div class="col-md-6">
								<div class="row">
									<span class=" font-weight-bold">
										{{ app.timesUsed }}
									</span>
								</div>
								<div class="row ">
									<span>Used</span>
								</div>
							</div>

							<div class="col-md-6">
								<div class="row">
									<span class=" font-weight-bold">{{ app.rate }}</span>
								</div>
								<div class="row">
									<span>Rate</span>
								</div>
							</div>
						</div>

						<div class="row justify-content-center align-items-center">
							<div class="col-md-12" style="margin-bottom: 10px;">
								<button v-if="app.isInstalled" type="button" class="btn btn-sm btn-danger" v-on:click="uninstallApp">Remove</button>
							</div>
						</div>
					</div>
				</div>
				<div class="row justify-content-between">
					<div class="col-auto  btn-group mb-2" role="group" >
						<button type="button" class="btn btn-sm btn-success mr-2" disabled><i class="fa fa-toolbox mr-2"></i> Add to toolbox  </button>
						<button type="button" class="btn btn-sm btn-primary mr-2" disabled><i class="fa fa-tachometer-alt mr-2"></i> Add to cockpit  </button>
					</div>
					<div class="col-auto  btn-group mb-2" role="group" v-show="isAppOwnedByCurrentUser(app)">
						<!-- <button type="button" class="btn btn-sm btn-primary mr-2" v-on:click="deleteModule()" title><i class="fa fa-edit mr-2"></i> Edit </button> -->
						
						<button type="button" class="btn btn-sm btn-primary mr-2" v-show="false"><i class="fa fa-code-branch mr-2"></i> Create release  </button>
						<!-- <button type="button" class="btn btn-sm btn-primary mr-2" ><i class="fa fa-project-diagram mr-2"></i> Edit diagram </button> -->
						<router-link 	v-if="app.diagramUid != null && isAppOwnedByCurrentUser(app)" 
																	:to="{ name: 'ComputationApplication', params: {applicationId: app.diagramUid } }" 
																	tag="button" 
																	class="btn btn-sm btn-primary mr-2" 
																	type="button"
																	:disabled="app.diagramUid == null"
													>
															<i class="fa fa-project-diagram mr-2"></i> Edit diagram
						</router-link>
						<router-link type="button" :to="{ name: 'ComputationApplication_Edit', params: {id: this.app.uid} }" class="btn btn-sm btn-primary mr-2">
							<i class="fa fa-edit mr-2"></i>Edit app
						</router-link>
						<button type="button" class="btn btn-sm btn-danger" data-toggle="modal" data-target="#delete-module"><i class="fa fa-trash mr-2"></i>Delete</button>
					</div>
				</div>
			</div>
		</div>

		<div class="row" style="margin-top: 20px;">
			<div class="col-md-12">
				<div class="card shadow mb-4">
					<div class="card-header py-3">
						<div class = "row justify-content-between pr-1 pl-1 ">
							<h5 class="m-0 font-weight-bold text-primary">Releases</h5>
							
							<button type="button" class="btn btn-sm btn-primary "  
								@click="showCreateAppReleaseModal(app.uid)"
								v-if="isAppOwnedByCurrentUser(app)" 
								> 
								<i class="fa fa-code-branch mr-2"></i>Create release
							</button>
						</div>
					</div>

					<div class="card-body">
						<div class="col-md-12">
							<div class="table-responsive">
								<table class="table table-bordered table-striped dataTable " id="release-table" width="100%" cellspacing="0" role="grid" aria-describedby="dataTable_info" style="width: 100%;padding:10px;">

									<thead>
										<tr role="row">
											<th>Version</th>
											<!-- <th>Author</th> -->
											<th>Release date</th>
											<th>Description</th>
											<th>OpenSource</th>
											<!-- <th>Private</th> -->
											<th>Status</th>
											<!-- <th>Available</th> -->
											<th class="text-center"> Actions</th>
										</tr>
									</thead>

									<tbody>
										<tr role="row" class="release" v-for="release in app.releases" v-bind:key="release.uid" :id="release.uid">

											<td>
												<router-link v-if="release.diagramUid != null" :to="{ name: 'ComputationApplicationReadOnly', params: {applicationId: release.diagramUid } }">
													{{ release.version }}
												</router-link>
												<span v-else> {{ release.version }} </span>
											</td>

											<!-- <td>{{ release.version }}</td> -->
											<!--<td :id="release.authorId">
												{{ release.authorName }}
											</td> -->
											<td>{{ release.date | moment("MMMM Do YYYY, HH:mm") }}</td>
											<td>{{ release.description}}</td>
											<td>{{ release._openSource }}</td>
											<!-- <td>{{ release._private }}</td> -->
											<td>{{ getReleaseStatusNameByID( release.status ) }}</td>	
											<!-- <td>
												<div class="col-md-12" style="margin-bottom: 10px;">
													<button 
														v-if="release._isInstalled" 
														type="button" class="btn btn-sm btn-danger" 
														v-on:click="uninstallApp">
														Remove from Cockpit
													</button>
													<button 
														v-if="release.status != 3 && !release._isInstalled" 
														type="button" class="btn btn-sm btn-success" 
														v-on:click="installApp">
														Add to Cockpit
													</button>

													
												</div>
												<div class="col-md-12" style="margin-bottom: 10px;">
													<button   
														v-if="isAppReleaseInToolbox(release)" 
														type="button" class="btn btn-sm btn-danger" 
														@click="removeAppReleaseFromToolbox(release)">
														Remove from Toolbox
													</button>
													<button
														v-if="release.status != 3 && !isAppReleaseInToolbox(release)"  
														type="button" class="btn btn-sm btn-success" 
														@click="addAppReleaseToToolbox(release)">
														Add to Toolbox
													</button>
												</div>
											</td> -->
											<td class="text-center">
												<!-- context menu   -->

												<div class="col-auto position-static">

													<!-- Dropdown -->
													<div class="dropdown  no-arrow position-static" >
													<a href="#" class="dropdown-ellipses dropdown-toggle" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" data-boundary="window">
														<i class="fas fa-ellipsis-v fa-sm fa-fw "></i>
													</a>
													<div class="dropdown-menu dropdown-menu-right " x-placement="top-end" >
														
														
														<!-- <a href="#!" class="dropdown-item h6 disabled">
															<i class="fa fa-toolbox dropdown-item-icon ">&nbsp;&nbsp;</i>
															Add to toolbox 1
														</a> -->
														<a class = "mb-2 dropdown-item h6 text-danger" 
																@click = "uninstallApp" 
																v-if="release._isInstalled"
																:disabled = "isLoading">
																<i class="fa fa-tachometer-alt dropdown-item-icon ">&nbsp;&nbsp;</i>
																	Remove from Cockpit
														</a>
														
														<a class = "mb-2 dropdown-item h6 text-success" 
															@click = "installApp"
															v-if=" release.status != 3 && !release._isInstalled" 
															:disabled = "isLoading">
															<i class="fa fa-tachometer-alt dropdown-item-icon ">&nbsp;&nbsp;</i>
																Add to Cockpit
														</a>

														<a class = "mb-2 dropdown-item h6 text-danger" 
															@click = "removeAppReleaseFromToolbox(release)" 
															v-if="isAppReleaseInToolbox(release)"
															:disabled = "isLoading">
															<i class="fa fa-toolbox dropdown-item-icon ">&nbsp;&nbsp;</i>
																Remove from toolbox
														</a>
														
														<a class = "mb-2 dropdown-item h6 text-success" 
															@click = "addAppReleaseToToolbox(release)"
															v-if=" release.status != 3 && !isAppReleaseInToolbox(release)" 
															:disabled = "isLoading">
															<i class="fa fa-toolbox dropdown-item-icon ">&nbsp;&nbsp;</i>
																Add to toolbox
														</a>

														<!-- <a href="#!" class="dropdown-item h6 disabled" v-show="isUnitOwnedByCurrentUser(module)">
															<i class="fa fa-edit dropdown-item-icon">&nbsp;&nbsp;</i>
															Edit
														</a> -->

														<router-link 
															tag="button"
															:disabled="false"
															v-show="isAppOwnedByCurrentUser(app)"
															:to="{ name: 'ComputationApplicationRelease_Edit', params: {id: release.uid} }" 
															class=" dropdown-item h6 mb-2 " 
															>
																<i class="fa fa-edit mr-2 "></i>Edit
														</router-link>
														
														<a  class="dropdown-item text-danger h6" 
															v-show="isAppOwnedByCurrentUser(app)"
															@click="currRelease = release" type="button"  data-toggle="modal" data-target="#delete-module-release">
																<i class="fa fa-trash dropdown-item-icon">&nbsp;&nbsp;</i>
																Delete
														</a>

													</div>
													</div>

												</div>
											</td>

										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

</template>

<script src="./AppDetails.js"></script>


