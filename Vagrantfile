# -*- mode: ruby -*-

# @param swap_size_mb [Integer] swap size in megabytes
# @param swap_file [String] full path for swap file, default is /swapfile1
# @return [String] the script text for shell inline provisioning
def create_swap(swap_size_mb, swap_file = "/swapfile1")
  <<-EOS
    if [ ! -f #{swap_file} ]; then
      echo "Creating #{swap_size_mb}mb swap file=#{swap_file}. This could take a while..."
      dd if=/dev/zero of=#{swap_file} bs=1024 count=#{swap_size_mb * 1024}
      mkswap #{swap_file}
      chmod 0600 #{swap_file}
      swapon #{swap_file}
      if ! grep -Fxq "#{swap_file} swap swap defaults 0 0" /etc/fstab
      then
        echo "#{swap_file} swap swap defaults 0 0" >> /etc/fstab
      fi
    fi
  EOS
end

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network :forwarded_port, guest: 9000, host: 9000

  config.vm.network "private_network", ip: "192.168.33.10"

  config.vm.synced_folder "./", "/home/vagrant/application"


  config.vm.provider "virtualbox" do |v|
    v.name = "Nodejs Dev Env"
    v.memory = 1024
  end

  config.vm.provision :shell, :inline => create_swap(2048, "/mnt/swapfile1")

  config.vm.provision "ansible" do |ansible|
    ansible.verbose = true
    ansible.playbook = "vagrant/site.yml"
    ansible.limit = "all"
    ansible.inventory_path = "vagrant/ansible_hosts"
  end
end
