install: package_install
clear: package_clear

package_install:
	$(info Installing packages ...)
	@docker run -it --rm -w=/home/node/app --volume '${CURDIR}':/home/node/app --user $(id -u):$(id -g) node npm install
	
package_clear:
	$(info Removing packages ...)
	@docker run -it --rm -w=/home/node/app --volume '${CURDIR}':/home/node/app --user $(id -u):$(id -g) bash -c 'rm -rf /home/node/app/node_modules'